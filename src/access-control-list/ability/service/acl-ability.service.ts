import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { DeepPartial, Repository } from 'typeorm';

import { AclAbility } from '../entity';

import { ConnectionNames } from '@/database/constant';

@Injectable()
export class AclAbilityService {
  constructor(
    @InjectRepository(AclAbility, ConnectionNames.Default)
    private aclAbilityRepository: Repository<AclAbility>,
    private readonly configService: ConfigService,
  ) {}

  async create(props: DeepPartial<AclAbility>): Promise<AclAbility> {
    return this.aclAbilityRepository.create(props);
  }

  async createMany(props: DeepPartial<AclAbility>[]): Promise<AclAbility[]> {
    return this.aclAbilityRepository.create(props);
  }
}
