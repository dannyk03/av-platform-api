import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
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

import { ReqOrganizationIdentifierCtx } from '../decorators/organization.decorator';
import { ReqUser } from '@/user/decorators';
import { ClientResponse } from '@/utils/response/decorators';

import { AclGuard } from '@/auth/guards';

import { IReqOrganizationIdentifierCtx } from '../types/organization.interface';

import { OrganizationInviteDto } from '../dto/organization.invite.dto';
import { OrganizationJoinDto } from '../dto/organization.join.dto';
import { MagicLinkDto } from '@/magic-link/dto';

import { ConnectionNames } from '@/database/constants';

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
      relations: ['role', 'organization'],
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

    const existingUser = await this.userService.findOne({
      where: { email: existingInvite.email },
      relations: ['authConfig', 'profile'],
      select: {
        authConfig: {
          id: true,
        },
      },
    });

    const { salt, passwordHash, passwordExpiredAt } =
      await this.authService.createPassword(password);

    await this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        if (existingUser) {
          existingUser.authConfig = {
            ...existingUser.authConfig,
            password: passwordHash,
            salt,
            passwordExpiredAt,
            emailVerifiedAt: this.helperDateService.create(),
          };

          existingUser.profile.firstName = firstName;
          existingUser.profile.lastName = lastName;
          await transactionalEntityManager.save(existingUser);
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

          await transactionalEntityManager.save(joinUser);
        }

        const now = this.helperDateService.create();
        existingInvite.usedAt = now;

        await transactionalEntityManager.save(existingInvite);
      },
    );
  }
}
