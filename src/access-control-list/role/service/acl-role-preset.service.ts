import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';

import { AclRolePreset } from '../entity';

import { ConnectionNames } from '@/database/constant';

@Injectable()
export class AclRolePresetService {
  constructor(
    @InjectRepository(AclRolePreset, ConnectionNames.Default)
    private aclRolePresetRepository: Repository<AclRolePreset>,
  ) {}

  async create(props: DeepPartial<AclRolePreset>): Promise<AclRolePreset> {
    return this.aclRolePresetRepository.create(props);
  }

  async createMany(
    props: DeepPartial<AclRolePreset>[],
  ): Promise<AclRolePreset[]> {
    return this.aclRolePresetRepository.create(props);
  }

  async findAll(): Promise<AclRolePreset[]> {
    return this.aclRolePresetRepository.find({
      relations: ['policy', 'policy.subjects', 'policy.subjects.abilities'],
    });
  }

  async findOneBy(
    find: FindOptionsWhere<AclRolePreset>,
  ): Promise<AclRolePreset> {
    return this.aclRolePresetRepository.findOneBy(find);
  }
}
