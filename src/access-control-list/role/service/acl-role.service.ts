import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, EntityManager, Repository } from 'typeorm';
// Services
import { AclPolicyService } from '@acl/policy/service/acl-policy.service';
import { AclAbilityService } from '@acl/ability/service/acl-ability.service';
import { AclSubjectService } from '@acl/subject/service/acl-subject.service';
//
import { ConnectionNames } from '@/database';
import { AclRole } from '../entity/acl-role.entity';

@Injectable()
export class AclRoleService {
  constructor(
    @InjectRepository(AclRole, ConnectionNames.Default)
    private aclRoleRepository: Repository<AclRole>,
    private readonly aclSubjectService: AclSubjectService,
    private readonly aclPolicyService: AclPolicyService,
    private readonly aclAbilityService: AclAbilityService,
    private readonly configService: ConfigService,
  ) {}

  async create(props: DeepPartial<AclRole>): Promise<AclRole> {
    return this.aclRoleRepository.create(props);
  }

  async createMany(props: DeepPartial<AclRole>[]): Promise<AclRole[]> {
    return this.aclRoleRepository.create(props);
  }

  async cloneSaveRolesTree(
    transactionalEntityManager: EntityManager,
    tree: DeepPartial<AclRole>[],
  ): Promise<AclRole[]> {
    const clone = await Promise.all(
      tree.map(async (role) => {
        const { policy } = role;
        const policySubjects = await Promise.all(
          policy.subjects.map(async (subject) => {
            const subjectAbilities = await Promise.all(
              subject.abilities.map(async (ability) => {
                const abilityEntity = await this.aclAbilityService.create({
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
        const roleEntity = await this.create({
          name: role.name,
          isActive: true,
          policy: policyEntity,
        });

        return transactionalEntityManager.save(roleEntity);
      }),
    );
    return clone;
  }
}
