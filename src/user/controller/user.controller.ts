import {
  Body,
  Controller,
  ForbiddenException,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isUUID } from 'class-validator';
// Services
import { AclRoleService } from '@acl/role/service';
import { DebuggerService } from '@/debugger/service/debugger.service';
import { UserService } from '../service/user.service';
import { HelperDateService, HelperSlugService } from '@/utils/helper/service';
import { EmailService } from '@/messaging/service';
import { UserInviteService } from '../service';
//
import { UserInviteDto } from '../dto/user.invite.dto';
import { Response, IResponse } from '@/utils/response';
import {
  EnumOrganizationStatusCodeError,
  IReqOrganizationIdentifierCtx,
  ReqOrganizationIdentifierCtx,
} from '@/organization';
import { AclGuard } from '@/auth';
import { EnumAclAbilityAction } from '@acl/ability';
import { AclSubjectTypeDict } from '@acl/subject';
import { EnumRoleStatusCodeError } from '@acl/role';
import { EnumMessagingStatusCodeError } from '@/messaging/messaging.constant';
import { SuccessException } from '@/utils/error';
import { EnumUserStatusCodeError } from '../user.constant';

@Controller({
  version: '1',
  path: 'user',
})
export class UserController {
  constructor(
    private readonly debuggerService: DebuggerService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly roleService: AclRoleService,
    private readonly userInviteService: UserInviteService,
    private readonly emailService: EmailService,
    private readonly helperSlugService: HelperSlugService,
    private readonly helperDateService: HelperDateService,
  ) {}

  @Response('user.invite')
  @AclGuard([
    {
      action: EnumAclAbilityAction.Create,
      subject: AclSubjectTypeDict.User,
    },
  ])
  @Post('/invite')
  async invite(
    @Body()
    { email, role }: UserInviteDto,
    @ReqOrganizationIdentifierCtx()
    { id, slug }: IReqOrganizationIdentifierCtx,
  ): Promise<IResponse> {
    const organizationCtxFind: Record<string, any> = {
      organization: { id, slug },
    };

    const expiresInDays = this.configService.get<number>(
      'user.inviteExpireInDays',
    );

    const roleId = isUUID(role) ? role : undefined;
    const roleSlug = !roleId ? this.helperSlugService.slugify(role) : undefined;

    const existingRole = await this.roleService.findOne({
      where: {
        ...organizationCtxFind,
        ...(roleId ? { id: roleId } : { slug: roleSlug }),
      },
      relations: ['organization'],
      select: {
        organization: {
          id: true,
          isActive: true,
        },
      },
    });

    if (!existingRole?.isActive) {
      this.debuggerService.error(
        'Role inactive error',
        'UserController',
        'invite',
      );

      throw new ForbiddenException({
        statusCode: EnumRoleStatusCodeError.RoleInactiveError,
        message: 'role.error.inactive',
      });
    }

    if (!existingRole.organization.isActive) {
      this.debuggerService.error(
        'Organization inactive error',
        'UserController',
        'invite',
      );

      throw new ForbiddenException({
        statusCode: EnumOrganizationStatusCodeError.OrganizationInactiveError,
        message: 'organization.error.inactive',
      });
    }

    const alreadyExistingUserInvite = await this.userInviteService.findOneBy({
      email,
    });

    if (!alreadyExistingUserInvite) {
      const userInvite = await this.userInviteService.create({
        email,
        role: existingRole,
        organization: existingRole.organization,
        // Set expired field after email send succeeded
      });

      await this.userInviteService.save(userInvite);

      const emailSent = await this.emailService.sendUserInvite({
        email,
        expiresInDays,
        inviteCode: userInvite.id,
      });

      if (emailSent) {
        userInvite.expires =
          this.helperDateService.forwardInDays(expiresInDays);
        await this.userInviteService.save(userInvite);

        return { inviteCode: userInvite.id };
      } else {
        this.debuggerService.error(
          'Messaging Email error',
          'UserController',
          'invite',
        );

        throw new InternalServerErrorException({
          statusCode: EnumMessagingStatusCodeError.MessagingEmailSendError,
          message: 'messaging.email.error.send',
        });
      }
    } else {
      const today = this.helperDateService.create();
      const inviteExpires =
        alreadyExistingUserInvite.expires &&
        this.helperDateService.create(alreadyExistingUserInvite.expires);

      if (!inviteExpires || today > inviteExpires) {
        const emailSent = await this.emailService.sendUserInvite({
          email,
          expiresInDays,
          inviteCode: alreadyExistingUserInvite.id,
        });
        if (emailSent) {
          alreadyExistingUserInvite.expires =
            this.helperDateService.forwardInDays(expiresInDays);
          await this.userInviteService.save(alreadyExistingUserInvite);

          return { inviteCode: alreadyExistingUserInvite.id };
        } else {
          this.debuggerService.error(
            'User Invite Email error',
            'UserController',
            'invite',
          );

          throw new InternalServerErrorException({
            statusCode: EnumMessagingStatusCodeError.MessagingEmailSendError,
            message: 'messaging.email.error.resend',
          });
        }
      } else {
        throw new SuccessException({
          statusCode: EnumUserStatusCodeError.UserAlreadyInvited,
          message: 'user.error.alreadyInvited',
        });
      }
    }
  }
}
