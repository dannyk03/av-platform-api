import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { DebuggerService } from 'src/debugger/service/debugger.service';
import { AuthService } from '@/auth/service/auth.service';
import { superSeedData } from './data';
import { OrganizationService } from '@/organization';
import { UserService } from '@/user';
import { AcpPolicyService } from '@acp/policy';
import { AcpSubjectService } from '@acp/subject';
import { AcpAbilityService } from '@acp/ability';
import { AcpRoleService, SystemRoleEnum } from '@acp/role';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConnectionNames } from '../database.constant';
import { HelperDateService } from '@/utils/helper';

@Injectable()
export class SuperSeed {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService,
    private readonly acpRoleService: AcpRoleService,
    private readonly acpPolicyService: AcpPolicyService,
    private readonly acpSubjectService: AcpSubjectService,
    private readonly acpAbilityService: AcpAbilityService,
    private readonly authService: AuthService,
    private readonly helperDateService: HelperDateService,
    private readonly debuggerService: DebuggerService,
  ) {}

  @Command({
    command: 'insert:super',
    describe: 'insert super data',
  })
  async insert(): Promise<void> {
    try {
      await this.defaultDataSource.transaction(
        'SERIALIZABLE',
        async (transactionalEntityManager) => {
          try {
            const systemRoles = await Promise.all(
              superSeedData.roles.map(async (role) => {
                const { policy } = role;
                const policySubjects = await Promise.all(
                  policy.subjects.map(async (subject) => {
                    const subjectAbilities = await Promise.all(
                      subject.abilities.map(async (ability) => {
                        const abilityEntity = this.acpAbilityService.create({
                          type: ability.type,
                          actions: ability.actions,
                        });

                        return transactionalEntityManager.save(abilityEntity);
                      }),
                    );
                    const subjectEntity = this.acpSubjectService.create({
                      type: subject.type,
                      sensitivityLevel: subject.sensitivityLevel,
                      abilities: subjectAbilities,
                    });

                    return transactionalEntityManager.save(subjectEntity);
                  }),
                );
                const policyEntity = this.acpPolicyService.create({
                  subjects: policySubjects,
                  sensitivityLevel: policy.sensitivityLevel,
                });

                await transactionalEntityManager.save(policyEntity);
                const roleEntity = this.acpRoleService.create({
                  name: role.name,
                  isActive: true,
                  policy: policyEntity,
                });

                return transactionalEntityManager.save(roleEntity);
              }),
            );

            const systemOrganization = this.organizationService.create({
              ...superSeedData.organization,
              roles: systemRoles,
            });

            await transactionalEntityManager.save(systemOrganization);

            const { salt, passwordHash } = this.authService.createPassword(
              process.env.AUTH_SUPER_ADMIN_INITIAL_PASS,
            );

            const superAdmin = this.userService.create({
              ...superSeedData.superAdmin,
              mobileNumber: '+00000000000',
              password: passwordHash,
              salt,
              passwordExpired: this.helperDateService.forwardInDays(365 * 10),
              organization: systemOrganization,
              role: systemRoles.find(
                (role) => role.name === SystemRoleEnum.SuperAdmin,
              ),
            });

            await transactionalEntityManager.save(superAdmin);

            this.debuggerService.debug(
              'Insert Super Succeed',
              'SuperSeed',
              'insert',
            );
          } catch (err) {
            this.debuggerService.error(
              err.message,
              'SuperSeed',
              'insert seed transaction',
            );
          }
        },
      );

      this.debuggerService.debug('Insert Super Succeed', 'SuperSeed', 'insert');
    } catch (err) {
      this.debuggerService.error(err.message, 'SuperSeed', 'insert');
    }
  }

  @Command({
    command: 'remove:super',
    describe: 'remove super data',
  })
  async remove(): Promise<void> {
    try {
      //   await this.userBulkService.deleteMany({});

      this.debuggerService.debug('Remove Super Succeed', 'SuperSeed', 'remove');
    } catch (e) {
      this.debuggerService.error(e.message, 'SuperSeed', 'remove');
    }
  }
}
