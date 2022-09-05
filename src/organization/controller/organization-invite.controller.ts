import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';

import { Action, Subjects } from '@avo/casl';
import {
  EnumOrganizationStatusCodeError,
  EnumRoleStatusCodeError,
  IResponseData,
} from '@avo/type';

import { isUUID } from 'class-validator';
import { DataSource } from 'typeorm';

import { User } from '@/user/entity';

import { OrganizationInviteService } from '../service';
import { AuthService } from '@/auth/service';
import { UserService } from '@/user/service';
import { HelperDateService, HelperSlugService } from '@/utils/helper/service';
import { AclRoleService } from '@acl/role/service';

import { ReqOrganizationIdentifierCtx } from '../decorator/organization.decorator';
import { ReqUser } from '@/user/decorator';
import { ClientResponse } from '@/utils/response/decorator';

import { AclGuard } from '@/auth/guard';

import { IReqOrganizationIdentifierCtx } from '../type/organization.interface';

import { OrganizationChangeRoleDto } from '../dto/organization.change-role.dto';
import { OrganizationInviteDto } from '../dto/organization.invite.dto';
import { OrganizationJoinDto } from '../dto/organization.join.dto';
import { MagicLinkDto } from '@/magic-link/dto';

import { BASIC_ROLE_NAME } from '@/access-control-list/role/constant/acl-role.constant';
import { ConnectionNames } from '@/database/constant';

@Controller({
  version: '1',
  path: 'org',
})
export class OrganizationInviteController {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    private readonly aclRoleService: AclRoleService,
    private readonly userService: UserService,
    private readonly organizationInviteService: OrganizationInviteService,
    private readonly authService: AuthService,
    private readonly helperSlugService: HelperSlugService,
    private readonly helperDateService: HelperDateService,
    private readonly configService: ConfigService,
  ) {}

  @ClientResponse('organization.invite')
  @HttpCode(HttpStatus.OK)
  @AclGuard({
    abilities: [
      {
        action: Action.Create,
        subject: Subjects.OrganizationInvite,
      },
    ],
  })
  @Post('/invite')
  async invite(
    @ReqUser()
    reqUser: User,
    @Body()
    { email, role }: OrganizationInviteDto,
    @ReqOrganizationIdentifierCtx()
    { id, slug }: IReqOrganizationIdentifierCtx,
  ): Promise<IResponseData> {
    const organizationCtxFind: Record<string, any> = {
      organization: { id, slug },
    };

    const roleId = isUUID(role) ? role : undefined;
    const roleSlug = !roleId
      ? this.helperSlugService.slugify(role || BASIC_ROLE_NAME)
      : undefined;

    const existingRole =
      (roleId || roleSlug) &&
      (await this.aclRoleService.findOne({
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
      }));

    if ((roleId || roleSlug) && !existingRole) {
      throw new ForbiddenException({
        statusCode: EnumRoleStatusCodeError.RoleNotFoundError,
        message: 'role.error.notFound',
      });
    }

    const result = await this.organizationInviteService.invite({
      email,
      aclRole: existingRole,
      fromUser: reqUser,
    });

    // For local development/testing
    const isProduction = this.configService.get<boolean>('app.isProduction');
    const isSecureMode = this.configService.get<boolean>('app.isSecureMode');
    if (!(isProduction || isSecureMode)) {
      return result;
    }
  }

  @ClientResponse('organization.join')
  @HttpCode(HttpStatus.OK)
  @Post('/join')
  async join(
    @Query()
    { code }: MagicLinkDto,
    @Body()
    { password, firstName, lastName }: OrganizationJoinDto,
  ) {
    const existingInvite = await this.organizationInviteService.findOne({
      where: { code },
      relations: ['role', 'organization', 'user'],
    });

    if (!existingInvite || existingInvite.usedAt) {
      throw new ForbiddenException({
        statusCode: EnumOrganizationStatusCodeError.OrganizationInviteUsedError,
        message: 'organization.error.inviteInvalid',
      });
    }

    if (!existingInvite.organization.isActive) {
      throw new ForbiddenException({
        statusCode: EnumOrganizationStatusCodeError.OrganizationInactiveError,
        message: 'organization.error.inactive',
      });
    }

    if (!existingInvite.role.isActive) {
      throw new ForbiddenException({
        statusCode: EnumRoleStatusCodeError.RoleInactiveError,
        message: 'role.error.inactive',
      });
    }

    const { salt, passwordHash, passwordExpiredAt } =
      await this.authService.createPassword(password);

    await this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        if (existingInvite.user) {
          existingInvite.user.organization = existingInvite.organization;
          existingInvite.user.role = existingInvite.role;
          await transactionalEntityManager.save(existingInvite.user);
        } else {
          const joinUser = await this.userService.create({
            email: existingInvite.email,
            authConfig: {
              password: passwordHash,
              emailVerifiedAt: this.helperDateService.create(),
              salt,
              passwordExpiredAt,
            },
            profile: {
              firstName,
              lastName,
            },
            organization: existingInvite.organization,
            role: existingInvite.role,
          });

          existingInvite.user = joinUser;

          await Promise.all([
            transactionalEntityManager.save(joinUser),
            transactionalEntityManager.save(existingInvite),
          ]);
        }

        const now = this.helperDateService.create();
        existingInvite.usedAt = now;

        await transactionalEntityManager.save(existingInvite);
      },
    );
  }

  @ClientResponse('organization.changeRole')
  @HttpCode(HttpStatus.OK)
  @AclGuard({
    abilities: [
      {
        action: Action.Update,
        subject: Subjects.OrganizationMember,
      },
    ],
  })
  @Post('/user/role')
  async updateUserRole(
    @ReqUser()
    reqUser: User,
    @Body()
    { email, role }: OrganizationChangeRoleDto,
    @ReqOrganizationIdentifierCtx()
    { id, slug }: IReqOrganizationIdentifierCtx,
  ): Promise<void> {
    if (reqUser.email === email) {
      throw new ForbiddenException({
        statusCode:
          EnumOrganizationStatusCodeError.OrganizationSelfChangeRoleForbiddenError,
        message: 'organization.error.selfChangeRole',
      });
    }

    const roleId = isUUID(role) ? role : undefined;
    const roleSlug = !roleId
      ? this.helperSlugService.slugify(role || BASIC_ROLE_NAME)
      : undefined;

    const existingRole =
      (roleId || roleSlug) &&
      (await this.aclRoleService.findOne({
        where: {
          organization: { id, slug },
          ...(roleId ? { id: roleId } : { slug: roleSlug }),
        },
        relations: ['organization'],
        select: {
          organization: {
            id: true,
            isActive: true,
          },
        },
      }));

    if ((roleId || roleSlug) && !existingRole) {
      throw new NotFoundException({
        statusCode: EnumRoleStatusCodeError.RoleNotFoundError,
        message: 'role.error.notFound',
      });
    }

    const organizationMember = await this.userService.findOne({
      where: { email, organization: { id, slug } },
    });

    if (!organizationMember) {
      throw new NotFoundException({
        statusCode:
          EnumOrganizationStatusCodeError.OrganizationMemberNotFoundError,
        message: 'organization.error.memberNotFound',
      });
    }

    organizationMember.role = existingRole;
    await this.userService.save(organizationMember);
  }
}
