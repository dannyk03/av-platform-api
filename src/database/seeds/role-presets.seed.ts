import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { Command } from 'nestjs-command';
import { DataSource } from 'typeorm';

import { AclAbility } from '@acl/ability/entity';
import { AclRole } from '@acl/role/entity';
import { AclSubject } from '@acl/subject/entity';

import { AclAbilityService } from '@acl/ability/service';
import { AclPolicyService } from '@acl/policy/service';
import { AclRolePresetService } from '@acl/role/service';
import { AclSubjectService } from '@acl/subject/service';

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
              rolePresetsSeedData.roles.map(async (role: AclRole) => {
                const { policy } = role;
                const policySubjects = await Promise.all(
                  policy.subjects.map(async (subject: AclSubject) => {
                    const subjectAbilities = await Promise.all(
                      subject.abilities.map(async (ability: AclAbility) => {
                        const abilityEntity =
                          await this.aclAbilityService.create({
                            type: ability.type,
                            action: ability.action,
                          });

                        return transactionalEntityManager.save(abilityEntity);
                      }),
                    );
                    const subjectEntity = await this.aclSubjectService.create({
                      type: subject.type,
                      abilities: subjectAbilities,
                    });

                    return transactionalEntityManager.save(subjectEntity);
                  }),
                );
                const policyEntity = await this.aclPolicyService.create({
                  subjects: policySubjects,
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
          } catch (err) {
            throw new Error(err.message);
          }
        },
      );
    } catch (err) {
      throw new Error(err.message);
    }
  }

  @Command({
    command: 'remove:role-presets',
    describe: 'remove role presets data',
  })
  async remove(): Promise<void> {
    throw new Error('Not Implemented remove:role-presets');
  }
}
