import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { Action, Subjects } from '@avo/casl';
import { EnumOrganizationStatusCodeError, IResponseData } from '@avo/type';

import { DataSource } from 'typeorm';

import { User } from '@/user/entity';

import { OrganizationInviteService, OrganizationService } from '../service';
import { AuthService } from '@/auth/service';
import { UserService } from '@/user/service';
import { AclRolePresetService, AclRoleService } from '@acl/role/service';

import { LogTrace } from '@/log/decorator';
import { ReqUser } from '@/user/decorator';
import { ClientResponse } from '@/utils/response/decorator';

import { AclGuard } from '@/auth/guard';

import { OrganizationCreateDto } from '../dto/organization.create.dto';

import { ConnectionNames } from '@/database/constant';
import { EnumLogAction } from '@/log/constant';
import { EnumOrganizationRole } from '@acl/role/constant';

@Controller({
  version: '1',
  path: 'org',
})
export class OrganizationController {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    private readonly organizationService: OrganizationService,
    private readonly organizationInviteService: OrganizationInviteService,
    private readonly userService: UserService,
    private readonly rolePresetService: AclRolePresetService,
    private readonly aclRoleService: AclRoleService,
    private readonly authService: AuthService,
  ) {}

  @ClientResponse('organization.create')
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.CreateOrganization, {
    tags: ['organization', 'create'],
  })
  @AclGuard({
    abilities: [
      {
        action: Action.Create,
        subject: Subjects.Organization,
      },
      {
        action: Action.Create,
        subject: Subjects.User,
      },
    ],
    systemOnly: true,
  })
  @Post('/create')
  async create(
    @ReqUser()
    reqUser: User,
    @Body()
    {
      name: organizationName,
      email: organizationOwnerEmail,
      password: initialOwnerPassword,
    }: OrganizationCreateDto,
  ): Promise<IResponseData> {
    const checkOrganizationExist =
      await this.organizationService.checkExistsByName(organizationName);

    const checkOrganizationOwnerExist =
      await this.userService.checkExistsByEmail(organizationOwnerEmail);

    if (checkOrganizationExist) {
      throw new BadRequestException({
        statusCode: EnumOrganizationStatusCodeError.OrganizationExistsError,
        message: 'organization.error.exists',
      });
    }

    if (checkOrganizationOwnerExist) {
      throw new BadRequestException({
        statusCode:
          EnumOrganizationStatusCodeError.OrganizationOwnerExistsError,
        message: 'organization.error.ownerExists',
      });
    }

    const rolePresets = await this.rolePresetService.findAll();

    return this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        const organizationRoles = await this.aclRoleService.cloneSaveRolesTree(
          transactionalEntityManager,
          rolePresets,
        );

        const organization = await this.organizationService.create({
          name: organizationName,
          roles: organizationRoles,
        });

        await transactionalEntityManager.save(organization);

        const { salt, passwordHash, passwordExpiredAt } =
          await this.authService.createPassword(initialOwnerPassword);

        const organizationOwnerRole = organizationRoles.find(
          (role) => role.name === EnumOrganizationRole.Owner,
        );

        organizationOwnerRole.organization = organization;

        const organizationOwner = await this.userService.create({
          email: organizationOwnerEmail,
          authConfig: {
            password: passwordHash,
            salt,
            passwordExpiredAt,
          },
          organization,
          role: organizationOwnerRole,
        });

        await transactionalEntityManager.save(organizationOwner);

        const inviteRes = await this.organizationInviteService.invite({
          transactionalEntityManager,
          email: organizationOwnerEmail,
          aclRole: organizationOwnerRole,
          fromUser: reqUser,
        });

        return {
          organization: { id: organization.id },
          owner: { id: organizationOwner.id },
          invite: inviteRes,
        };
      },
    );
  }
}
