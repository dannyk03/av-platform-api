import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { ConnectionNames } from '@/database';
import { AcpRolePreset } from '../entity/acp-role-preset.entity';

@Injectable()
export class AcpRolePresetService {
  constructor(
    @InjectRepository(AcpRolePreset, ConnectionNames.Default)
    private acpRolePresetRepository: Repository<AcpRolePreset>,
    private readonly configService: ConfigService,
  ) {}

  async create(props: DeepPartial<AcpRolePreset>): Promise<AcpRolePreset> {
    return this.acpRolePresetRepository.create(props);
  }

  async createMany(
    props: DeepPartial<AcpRolePreset>[],
  ): Promise<AcpRolePreset[]> {
    return this.acpRolePresetRepository.create(props);
  }

  async findAll(): Promise<AcpRolePreset[]> {
    const presets = await this.acpRolePresetRepository.find({
      relations: ['policy'],
    });
    return presets;
  }
}
