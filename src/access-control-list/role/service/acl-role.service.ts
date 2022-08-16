import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { plainToInstance } from 'class-transformer';
import { isUUID } from 'class-validator';
import {
  DeepPartial,
  EntityManager,
  FindOneOptions,
  Repository,
} from 'typeorm';

import { AclRole } from '../entity';

import { HelperSlugService } from '@/utils/helper/service';
import { AclAbilityService } from '@acl/ability/service';
import { AclPolicyService } from '@acl/policy/service';
import { AclSubjectService } from '@acl/subject/service';

import { RoleGetSerialization } from '../serialization/acl-role.get.serialization';

import { ConnectionNames } from '@/database';
import { IPaginationOptions } from '@/utils/pagination';

@Injectable()
export class AclRoleService {
  constructor(
    @InjectRepository(AclRole, ConnectionNames.Default)
    private aclRoleRepository: Repository<AclRole>,
    private readonly aclSubjectService: AclSubjectService,
    private readonly aclPolicyService: AclPolicyService,
    private readonly aclAbilityService: AclAbilityService,
    private readonly helperSlugService: HelperSlugService,
  ) {}

  async create(props: DeepPartial<Omit<AclRole, 'slug'>>): Promise<AclRole> {
    return this.aclRoleRepository.create(props);
  }

  async createMany(
    props: DeepPartial<Omit<AclRole, 'slug'>>[],
  ): Promise<AclRole[]> {
    return this.aclRoleRepository.create(props);
  }

  async getTotal(find?: Record<string, any>): Promise<number> {
    return this.aclRoleRepository.countBy(find);
  }

  async findAll(
    find?: Record<string, any>,
    options?: IPaginationOptions,
  ): Promise<AclRole[]> {
    return this.aclRoleRepository.find({ where: find, ...options });
  }

  async findOne(find?: FindOneOptions<AclRole>): Promise<AclRole> {
    return this.aclRoleRepository.findOne({ ...find });
  }

  async cloneSaveRolesTree(
    transactionalEntityManager: EntityManager,
    tree: DeepPartial<AclRole>[],
  ): Promise<AclRole[]> {
    return Promise.all(
      tree.map(async (role) => {
        const { policy } = role;
        const policySubjects = await Promise.all(
          policy.subjects.map(async (subject) => {
            const subjectAbilities = await Promise.all(
              subject.abilities.map(async (ability) => {
                const abilityEntity = await this.aclAbilityService.create({
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
        const roleEntity = await this.create({
          name: role.name,
          isActive: true,
          policy: policyEntity,
        });

        return transactionalEntityManager.save(roleEntity);
      }),
    );
  }

  async findBy(
    roleIdOrSlug: string,
    organizationIdOrSlug: string,
  ): Promise<AclRole> {
    const organizationId = isUUID(organizationIdOrSlug)
      ? organizationIdOrSlug
      : undefined;
    const organizationSlug = !organizationId
      ? this.helperSlugService.slugify(organizationIdOrSlug)
      : undefined;

    const roleId = isUUID(roleIdOrSlug) ? roleIdOrSlug : undefined;
    const roleSlug = !roleId
      ? this.helperSlugService.slugify(roleIdOrSlug)
      : undefined;

    if ((roleId || roleSlug) && (organizationId || organizationSlug)) {
      return this.aclRoleRepository.findOneBy({
        ...(roleId ? { id: roleId } : { slug: roleSlug }),
        ...(organizationId
          ? { organization: { id: organizationId } }
          : { organization: { slug: organizationSlug } }),
      });
    }

    return null;
  }

  async serializationList(data: AclRole[]): Promise<RoleGetSerialization[]> {
    return plainToInstance(RoleGetSerialization, data);
  }
}
