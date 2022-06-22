import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { ConnectionNames } from '@/database';
import { AcpPolicy } from '../entity/acp-policy.entity';

@Injectable()
export class AcpPolicyService {
  constructor(
    @InjectRepository(AcpPolicy, ConnectionNames.Default)
    private acpPolicyRepository: Repository<AcpPolicy>,
    private readonly configService: ConfigService,
  ) {}

  async create(props: DeepPartial<AcpPolicy>): Promise<AcpPolicy> {
    return this.acpPolicyRepository.create(props);
  }

  async createMany(props: DeepPartial<AcpPolicy>[]): Promise<AcpPolicy[]> {
    return this.acpPolicyRepository.create(props);
  }
}
