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
// Services
import { DebuggerService } from '@/debugger/service/debugger.service';
import { UserService } from '@/user/service/user.service';
import { AclRoleService } from '@acl/role/service/acl-role.service';
import { AclRolePresetService } from '@acl/role/service/acl-role-preset.service';
import { AuthService } from '@/auth/service/auth.service';
import { OrganizationService } from '../service/organization.service';
import { LogService } from '@/log/service/log.service';
//
import { OrganizationCreateDto } from '../dto/organization.create.dto';
import { EnumOrganizationStatusCodeError } from '../organization.constant';
import { EnumAclAbilityAction } from '@acl/ability';
import { AclSubjectTypeDict } from '@acl/subject';
import { Response, IResponse } from '@/utils/response';
import { EnumStatusCodeError } from '@/utils/error';
import { EnumOrganizationRole } from '@acl/role';
import { ConnectionNames } from '@/database';
import { AclGuard } from '@/auth';
import { EnumLoggerAction, IReqLogData } from '@/log';
import { GetReqUser } from '@/user/user.decorator';
import { User } from '@/user/entity/user.entity';
import { ReqLogData } from '@/utils/request';

@Controller({
  version: '1',
  path: 'organization',
})
export class OrganizationAdminController {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    private readonly debuggerService: DebuggerService,
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService,
    private readonly rolePresetService: AclRolePresetService,
    private readonly aclRoleService: AclRoleService,
    private readonly authService: AuthService,
    private readonly logService: LogService,
  ) {}

  @Response('organization.create')
  @AclGuard(
    {
      action: EnumAclAbilityAction.Create,
      subject: AclSubjectTypeDict.Organization,
    },
    {
      action: EnumAclAbilityAction.Create,
      subject: AclSubjectTypeDict.User,
    },
  )
  @HttpCode(HttpStatus.OK)
  @Post('/create')
  async create(
    @Body()
    body: OrganizationCreateDto,
    @GetReqUser()
    user: User,
    @ReqLogData()
    logData: IReqLogData,
  ): Promise<IResponse> {
    const checkOrganizationExist =
      await this.organizationService.checkExistByName(body.name);

    const checkOrganizationOwnerExist =
      await this.userService.checkExistByEmail(body.email);

    if (checkOrganizationExist) {
      this.debuggerService.error(
        'create organization exist',
        'OrganizationController',
        'create',
        body.name,
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
        body.email,
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
            name: body.name,
            roles: organizationRoles,
          });

          await transactionalEntityManager.save(organization);

          const { salt, passwordHash, passwordExpired } =
            await this.authService.createPassword(body.password);

          const organizationOwner = await this.userService.create({
            // TODO change to false when email validation flow will be ready
            isActive: true,
            email: body.email,
            password: passwordHash,
            salt,
            passwordExpired,
            organization,
            role: organizationRoles.find(
              (role) => role.name === EnumOrganizationRole.Owner,
            ),
          });

          await transactionalEntityManager.save(organizationOwner);

          this.debuggerService.debug(
            'Organization Create Succeed',
            'OrganizationAdminController',
            'create',
            {
              organization: { id: organization.id },
              owner: { id: organizationOwner.id },
            },
          );

          return {
            organization: { id: organization.id },
            owner: { id: organizationOwner.id },
          };
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

    await this.logService.info({
      ...logData,
      action: EnumLoggerAction.CreateOrganization,
      description: `${user.id} created organization`,
      user: user,
      tags: ['create', 'organization'],
    });

    return result;
  }
}
