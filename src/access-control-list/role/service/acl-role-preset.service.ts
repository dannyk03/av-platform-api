import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { ConnectionNames } from '@/database';
import { AclRolePreset } from '../entity/acl-role-preset.entity';

@Injectable()
export class AclRolePresetService {
  constructor(
    @InjectRepository(AclRolePreset, ConnectionNames.Default)
    private aclRolePresetRepository: Repository<AclRolePreset>,
    private readonly configService: ConfigService,
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
    const presets = await this.aclRolePresetRepository.find({
      relations: ['policy', 'policy.subjects', 'policy.subjects.abilities'],
    });
    return presets;
  }
}