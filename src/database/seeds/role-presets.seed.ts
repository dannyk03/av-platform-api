import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
// Services
import { DebuggerService } from '@/debugger/service/debugger.service';
import { AcpPolicyService } from '@acp/policy/service/acp-policy.service';
import { AcpSubjectService } from '@acp/subject/service/acp-subject.service';
import { AcpAbilityService } from '@acp/ability/service/acp-ability.service';
import { AcpRolePresetService } from '@acp/role/service/acp-role-preset.service';
//
import { ConnectionNames } from '../database.constant';
import { rolePresetsSeedData } from './data';

@Injectable()
export class RolePresetsSeed {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    private readonly acpRolePresetService: AcpRolePresetService,
    private readonly acpPolicyService: AcpPolicyService,
    private readonly acpSubjectService: AcpSubjectService,
    private readonly acpAbilityService: AcpAbilityService,
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
                          await this.acpAbilityService.create({
                            type: ability.type,
                            actions: ability.actions,
                          });

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
                const roleEntity = await this.acpRolePresetService.create({
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
