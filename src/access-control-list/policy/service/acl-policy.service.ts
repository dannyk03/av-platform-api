import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { ConnectionNames } from '@/database';
import { AclPolicy } from '../entity/acl-policy.entity';

@Injectable()
export class AclPolicyService {
  constructor(
    @InjectRepository(AclPolicy, ConnectionNames.Default)
    private aclPolicyRepository: Repository<AclPolicy>,
    private readonly configService: ConfigService,
  ) {}

  async create(props: DeepPartial<AclPolicy>): Promise<AclPolicy> {
    return this.aclPolicyRepository.create(props);
  }

  async createMany(props: DeepPartial<AclPolicy>[]): Promise<AclPolicy[]> {
    return this.aclPolicyRepository.create(props);
  }
}
