import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { ConnectionNames } from '@/database';
import { AcpAbility } from '../entity/acp-ability.entity';

@Injectable()
export class AcpAbilityService {
  constructor(
    @InjectRepository(AcpAbility, ConnectionNames.Default)
    private acpAbilityRepository: Repository<AcpAbility>,
    private readonly configService: ConfigService,
  ) {}

  create(props: DeepPartial<AcpAbility>): AcpAbility {
    return this.acpAbilityRepository.create(props);
  }

  createMany(props: DeepPartial<AcpAbility>[]): AcpAbility[] {
    return this.acpAbilityRepository.create(props);
  }
}
