import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
// Services
import { DebuggerService } from '@/debugger/service/debugger.service';
import { AclPolicyService } from '@acl/policy/service/acl-policy.service';
import { AclSubjectService } from '@acl/subject/service/acl-subject.service';
import { AclAbilityService } from '@acl/ability/service/acl-ability.service';
import { AclRolePresetService } from '@acl/role/service/acl-role-preset.service';
//
import { ConnectionNames } from '../database.constant';
import { rolePresetsSeedData } from './data';

@Injectable()
export class RolePresetsSeed {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    private readonly aclRolePresetService: AclRolePresetService,
    private readonly aclPolicyService: AclPolicyService,
    private readonly aclSubjectService: AclSubjectService,
    private readonly aclAbilityService: AclAbilityService,
    private readonly debuggerService: DebuggerService,
  ) {}

  @Command({
    command: 'insert:role-presets',
    describe: 'insert role presets data',
  })
  async insert(): Promise<void> {
    try {
      await this.defaultDataSource.transaction(
        'SERIALIZABLE',
        async (transactionalEntityManager) => {
          try {
            const rolePresets = await Promise.all(
              rolePresetsSeedData.roles.map(async (role) => {
                const { policy } = role;
                const policySubjects = await Promise.all(
                  policy.subjects.map(async (subject) => {
                    const subjectAbilities = await Promise.all(
                      subject.abilities.map(async (ability) => {
                        const abilityEntity =
                          await this.aclAbilityService.create({
                            type: ability.type,
                            actions: ability.actions,
                          });

                        return transactionalEntityManager.save(abilityEntity);
                      }),
                    );
                    const subjectEntity = await this.aclSubjectService.create({
                      type: subject.type,
                      sensitivityLevel: subject.sensitivityLevel,
                      abilities: subjectAbilities,
                    });

                    return transactionalEntityManager.save(subjectEntity);
                  }),
                );
                const policyEntity = await this.aclPolicyService.create({
                  subjects: policySubjects,
                  sensitivityLevel: policy.sensitivityLevel,
                });

                await transactionalEntityManager.save(policyEntity);
                const roleEntity = await this.aclRolePresetService.create({
                  name: role.name,
                  policy: policyEntity,
                });

                return transactionalEntityManager.save(roleEntity);
              }),
            );

            await transactionalEntityManager.save(rolePresets);

            this.debuggerService.debug(
              'Insert Role Presets Succeed',
              'RolePresetsSeed',
              'insert',
            );
          } catch (err) {
            this.debuggerService.error(
              err.message,
              'RolePresetsSeed',
              'insert seed transaction',
            );
          }
        },
      );

      this.debuggerService.debug(
        'Insert Role Presets Succeed',
        'RolePresetsSeed',
        'insert',
      );
    } catch (err) {
      this.debuggerService.error(err.message, 'SystemSeed', 'insert');
    }
  }

  @Command({
    command: 'remove:role-presets',
    describe: 'remove role presets data',
  })
  async remove(): Promise<void> {
    try {
      throw new Error('Not Implemented remove:role-presets');
      this.debuggerService.debug(
        'Remove Role Presets Succeed',
        'RolePresetsSeed',
        'remove',
      );
    } catch (e) {
      this.debuggerService.error(e.message, 'RolePresetsSeed', 'remove');
    }
  }
}
