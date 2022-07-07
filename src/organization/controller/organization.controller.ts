import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Subject, Action } from '@avo/casl';
// Services
import { DebuggerService } from '@/debugger/service/debugger.service';
import { UserService } from '@/user/service/user.service';
import { AclRoleService, AclRolePresetService } from '@acl/role/service';
import { AuthService } from '@/auth/service/auth.service';
import { OrganizationService } from '../service/organization.service';
import { OrganizationInviteService } from '../service/organization-invite.service';
import { LogService } from '@/log/service/log.service';
//
import { OrganizationCreateDto } from '../dto/organization.create.dto';
import { EnumOrganizationStatusCodeError } from '../organization.constant';
import { Response, IResponse } from '@/utils/response';
import { EnumStatusCodeError } from '@/utils/error';
import { EnumOrganizationRole } from '@acl/role';
import { ConnectionNames } from '@/database';
import { AclGuard } from '@/auth';
import { EnumLoggerAction, IReqLogData } from '@/log';
import { ReqUser } from '@/user/user.decorator';
import { User } from '@/user/entity/user.entity';
import { ReqLogData } from '@/utils/request';

@Controller({
  version: '1',
  path: 'organization',
})
export class OrganizationController {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    private readonly debuggerService: DebuggerService,
    private readonly organizationService: OrganizationService,
    private readonly organizationInviteService: OrganizationInviteService,
    private readonly userService: UserService,
    private readonly rolePresetService: AclRolePresetService,
    private readonly aclRoleService: AclRoleService,
    private readonly authService: AuthService,
    private readonly logService: LogService,
  ) {}

  @Response('organization.create')
  @HttpCode(HttpStatus.OK)
  @AclGuard(
    [
      {
        action: Action.Create,
        subject: Subject.Organization,
      },
      {
        action: Action.Create,
        subject: Subject.User,
      },
    ],
    { systemOnly: true },
  )
  @Post('/create')
  async create(
    @Body()
    {
      name: organizationName,
      email: organizationOwnerEmail,
      password: initialOwnerPassword,
    }: OrganizationCreateDto,
    @ReqUser()
    reqUser: User,
    @ReqLogData()
    logData: IReqLogData,
  ): Promise<IResponse> {
    const checkOrganizationExist =
      await this.organizationService.checkExistsByName(organizationName);

    const checkOrganizationOwnerExist =
      await this.userService.checkExistsByEmail(organizationOwnerEmail);

    if (checkOrganizationExist) {
      this.debuggerService.error(
        'create organization exist',
        'OrganizationController',
        'create',
        organizationName,
      );

      throw new BadRequestException({
        statusCode: EnumOrganizationStatusCodeError.OrganizationExistsError,
        message: 'organization.error.exist',
      });
    } else if (checkOrganizationOwnerExist) {
      this.debuggerService.error(
        'create organization user exist',
        'OrganizationController',
        'create',
        organizationOwnerEmail,
      );

      throw new BadRequestException({
        statusCode:
          EnumOrganizationStatusCodeError.OrganizationOwnerExistsError,
        message: 'organization.error.ownerExist',
      });
    }

    const rolePresets = await this.rolePresetService.findAll();

    const result = await this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        try {
          const organizationRoles =
            await this.aclRoleService.cloneSaveRolesTree(
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
            isActive: true,
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

          this.debuggerService.debug(
            'Organization Create Succeed',
            'OrganizationAdminController',
            'create',
            organizationCreateResult,
          );

          await this.logService.info({
            ...logData,
            action: EnumLoggerAction.CreateOrganization,
            description: `${reqUser.id} created organization`,
            user: reqUser,
            tags: ['create', 'organization'],
            transactionalEntityManager,
          });

          return organizationCreateResult;
        } catch (err) {
          this.debuggerService.error(
            err.message,
            'OrganizationAdminController',
            'create',
            err,
          );

          throw new InternalServerErrorException({
            statusCode: EnumStatusCodeError.UnknownError,
            message: 'http.serverError.internalServerError',
          });
        }
      },
    );

    return result;
  }
}
