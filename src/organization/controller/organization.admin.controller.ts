import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
// import { AuthAdminJwtGuard } from '@/auth';
import { Response, IResponse } from '@/utils/response';
import { EnumStatusCodeError } from '@/utils/error';
import { EnumOrganizationRole } from '@acp/role';
import { ConnectionNames } from '@/database';
// Services
import { DebuggerService } from '@/debugger/service/debugger.service';
import { UserService } from '@/user/service/user.service';
import { AcpRoleService } from '@acp/role/service/acp-role.service';
import { AcpRolePresetService } from '@acp/role/service/acp-role-preset.service';
import { AcpAbilityService } from '@acp/ability/service/acp-ability.service';
import { AcpPolicyService } from '@acp/policy/service/acp-policy.service';
import { AcpSubjectService } from '@acp/subject/service/acp-subject.service';
import { AuthService } from '@/auth/service/auth.service';
//
import { OrganizationService } from '../service/organization.service';
import { OrganizationCreateDto } from '../dto/organization.create.dto';
import { EnumOrganizationStatusCodeError } from '../organization.constant';

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
    private readonly rolePresetService: AcpRolePresetService,
    private readonly acpRoleService: AcpRoleService,
    private readonly acpPolicyService: AcpPolicyService,
    private readonly acpSubjectService: AcpSubjectService,
    private readonly acpAbilityService: AcpAbilityService,
    private readonly authService: AuthService,
  ) {}

  @Response('organization.create')
  // @AuthAdminJwtGuard(ENUM_PERMISSIONS.USER_READ, ENUM_PERMISSIONS.USER_CREATE)
  @Post('/create')
  async create(
    @Body()
    body: OrganizationCreateDto,
  ): Promise<IResponse> {
    const checkOrganizationExist =
      await this.organizationService.checkExistByName(body.name);

    const checkUserExist = await this.userService.checkExistByEmail(body.email);

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
    } else if (checkUserExist) {
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
          const organizationRoles = await Promise.all(
            rolePresets.map(async (role) => {
              const { policy } = role;
              const policySubjects = await Promise.all(
                policy.subjects.map(async (subject) => {
                  const subjectAbilities = await Promise.all(
                    subject.abilities.map(async (ability) => {
                      const abilityEntity = await this.acpAbilityService.create(
                        {
                          type: ability.type,
                          actions: ability.actions,
                        },
                      );

                      return transactionalEntityManager.save(abilityEntity);
                    }),
                  );
                  const subjectEntity = await this.acpSubjectService.create({
                    type: subject.type,
                    sensitivityLevel: subject.sensitivityLevel,
                    abilities: subjectAbilities,
                  });

                  return transactionalEntityManager.save(subjectEntity);
                }),
              );
              const policyEntity = await this.acpPolicyService.create({
                subjects: policySubjects,
                sensitivityLevel: policy.sensitivityLevel,
              });

              await transactionalEntityManager.save(policyEntity);
              const roleEntity = await this.acpRoleService.create({
                name: role.name,
                isActive: true,
                policy: policyEntity,
              });

              return transactionalEntityManager.save(roleEntity);
            }),
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
    return result;
  }
}
