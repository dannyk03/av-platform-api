import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { EnumOrganizationRole } from '@acl/role';
import { DataSource } from 'typeorm';

import { Action, Subject } from '@avo/casl';

import { OrganizationInviteService, OrganizationService } from '../service';
import { AuthService } from '@/auth/service';
import { UserService } from '@/user/service';
import { AclRolePresetService, AclRoleService } from '@acl/role/service';

import { OrganizationCreateDto } from '../dto/organization.create.dto';

import { AclGuard } from '@/auth';
import { ConnectionNames } from '@/database';
import { EnumLogAction, LogTrace } from '@/log';
import { Response } from '@/utils/response';

import { EnumOrganizationStatusCodeError } from '../organization.constant';

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

  @Response('organization.create')
  @HttpCode(HttpStatus.OK)
  @LogTrace(EnumLogAction.CreateOrganization, {
    tags: ['organization', 'create'],
  })
  @AclGuard({
    abilities: [
      {
        action: Action.Create,
        subject: Subject.Organization,
      },
      {
        action: Action.Create,
        subject: Subject.User,
      },
    ],
    systemOnly: true,
  })
  @Post('/create')
  async create(
    @Body()
    {
      name: organizationName,
      email: organizationOwnerEmail,
      password: initialOwnerPassword,
    }: OrganizationCreateDto,
  ): Promise<void> {
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

    await this.defaultDataSource.transaction(
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
        });

        const organizationCreateResult = {
          organization: { id: organization.id },
          owner: { id: organizationOwner.id },
          invite: inviteRes,
        };

        return organizationCreateResult;
      },
    );
  }
}
