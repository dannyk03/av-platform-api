import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
// Services
import { DebuggerService } from '@/debugger/service/debugger.service';
import { AclRoleService } from '@acl/role/service';
import { LogService } from '@/log/service/log.service';
import { HelperSlugService, HelperDateService } from '@/utils/helper/service';
import { OrganizationInviteService } from '../service/organization-invite.service';
//
import { EnumOrganizationStatusCodeError } from '../organization.constant';
import { EnumAclAbilityAction } from '@acl/ability';
import { AclSubjectTypeDict } from '@acl/subject';
import { Response, IResponse } from '@/utils/response';
import { EnumRoleStatusCodeError } from '@acl/role';
import { AclGuard } from '@/auth';
import { OrganizationInviteDto } from '../dto/organization.invite.dto';
import { ReqOrganizationIdentifierCtx } from '../organization.decorator';
import { IReqOrganizationIdentifierCtx } from '../organization.interface';
import { ConfigService } from '@nestjs/config';
import { OrganizationInviteValidateDto } from '../dto';
import { EnumLoggerAction, IReqLogData } from '@/log';
import { ReqUser } from '@/user/user.decorator';
import { ReqLogData } from '@/utils/request';

@Controller({
  version: '1',
  path: 'organization',
})
export class OrganizationInviteController {
  constructor(
    private readonly configService: ConfigService,
    private readonly logService: LogService,
    private readonly debuggerService: DebuggerService,
    private readonly aclRoleService: AclRoleService,
    private readonly organizationInviteService: OrganizationInviteService,
    private readonly helperSlugService: HelperSlugService,
    private readonly helperDateService: HelperDateService,
  ) {}

  @Response('organization.invite')
  @HttpCode(HttpStatus.OK)
  @AclGuard([
    {
      action: EnumAclAbilityAction.Create,
      subject: AclSubjectTypeDict.User,
    },
  ])
  @Post('/invite')
  async invite(
    @Body()
    { email, role }: OrganizationInviteDto,
    @ReqOrganizationIdentifierCtx()
    { id, slug }: IReqOrganizationIdentifierCtx,
  ): Promise<IResponse> {
    const organizationCtxFind: Record<string, any> = {
      organization: { id, slug },
    };

    const roleId = isUUID(role) ? role : undefined;
    const roleSlug = !roleId ? this.helperSlugService.slugify(role) : undefined;

    const existingRole = await this.aclRoleService.findOne({
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

    if (!existingRole) {
      throw new ForbiddenException({
        statusCode: EnumRoleStatusCodeError.RoleNotFoundError,
        message: 'role.error.notFound',
      });
    }

    return await this.organizationInviteService.invite({
      email,
      aclRole: existingRole,
    });
  }

  @Response('organization.inviteValid')
  @Get('/join')
  async joinValidate(
    @Query()
    { inviteCode }: OrganizationInviteValidateDto,
  ) {
    const existingInvite = await this.organizationInviteService.findOneBy({
      inviteCode,
    });

    if (!existingInvite) {
      throw new NotFoundException({
        statusCode:
          EnumOrganizationStatusCodeError.OrganizationInviteNotFoundError,
        message: 'organization.error.inviteInvalid',
      });
    }

    const now = this.helperDateService.create();
    const expiresAt = this.helperDateService.create(existingInvite.expiresAt);

    if (now > expiresAt || existingInvite.usedAt) {
      throw new ForbiddenException({
        statusCode:
          EnumOrganizationStatusCodeError.OrganizationInviteExpiredError,
        message: 'organization.error.inviteInvalid',
      });
    }

    return;
  }

  @Response('organization.join')
  @Post('/join')
  async join(
    @Query()
    { inviteCode }: OrganizationInviteValidateDto,
  ) {
    const existingInvite = await this.organizationInviteService.findOneBy({
      inviteCode,
    });

    if (existingInvite.usedAt) {
      throw new ForbiddenException({
        statusCode: EnumOrganizationStatusCodeError.OrganizationInviteUsedError,
        message: 'organization.error.inviteInvalid',
      });
    }

    // TODO create User
    const now = this.helperDateService.create();
    existingInvite.usedAt = now;

    await this.organizationInviteService.save(existingInvite);

    return;
  }
}
