import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';

import { DataSource } from 'typeorm';

import { AclAbility } from '@/access-control-list/ability/entity';
import { AclRole } from '@/access-control-list/role/entity';
import { AclSubject } from '@/access-control-list/subject/entity';

import { AclAbilityService } from '@/access-control-list/ability/service';
import { AclPolicyService } from '@/access-control-list/policy/service';
import { AclRolePresetService } from '@/access-control-list/role/service';
import { AclSubjectService } from '@/access-control-list/subject/service';

import { ConnectionNames } from '@/database/constants/database.constant';

import { rolePresetsSeedData } from '../data';

@Injectable()
export class RolePresetsSeedService {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    private readonly aclRolePresetService: AclRolePresetService,
    private readonly aclPolicyService: AclPolicyService,
    private readonly aclSubjectService: AclSubjectService,
    private readonly aclAbilityService: AclAbilityService,
    private readonly configService: ConfigService,
  ) {}

  async insert(): Promise<void> {
    const runSeeds = this.configService.get<boolean>('app.runSeeds');

    if (!runSeeds) {
      return;
    }

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
}
