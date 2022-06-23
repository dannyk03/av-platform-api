import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, EntityManager, Repository } from 'typeorm';
// Services
import { AcpPolicyService } from '@acp/policy/service/acp-policy.service';
import { AcpAbilityService } from '@acp/ability/service/acp-ability.service';
import { AcpSubjectService } from '@acp/subject/service/acp-subject.service';
//
import { ConnectionNames } from '@/database';
import { AcpRole } from '../entity/acp-role.entity';

@Injectable()
export class AcpRoleService {
  constructor(
    @InjectRepository(AcpRole, ConnectionNames.Default)
    private acpRoleRepository: Repository<AcpRole>,
    private readonly acpSubjectService: AcpSubjectService,
    private readonly acpPolicyService: AcpPolicyService,
    private readonly acpAbilityService: AcpAbilityService,
    private readonly configService: ConfigService,
  ) {}

  async create(props: DeepPartial<AcpRole>): Promise<AcpRole> {
    return this.acpRoleRepository.create(props);
  }

  async createMany(props: DeepPartial<AcpRole>[]): Promise<AcpRole[]> {
    return this.acpRoleRepository.create(props);
  }

  async cloneSaveRolesTree(
    transactionalEntityManager: EntityManager,
    tree: DeepPartial<AcpRole>[],
  ): Promise<AcpRole[]> {
    const clone = await Promise.all(
      tree.map(async (role) => {
        const { policy } = role;
        const policySubjects = await Promise.all(
          policy.subjects.map(async (subject) => {
            const subjectAbilities = await Promise.all(
              subject.abilities.map(async (ability) => {
                const abilityEntity = await this.acpAbilityService.create({
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
