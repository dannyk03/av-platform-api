import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { ConnectionNames } from '@/database';
import { AcpRole } from '../entity/acp-role.entity';

@Injectable()
export class AcpRoleService {
  constructor(
    @InjectRepository(AcpRole, ConnectionNames.Default)
    private acpRoleRepository: Repository<AcpRole>,
    private readonly configService: ConfigService,
  ) {}

  async create(props: DeepPartial<AcpRole>): Promise<AcpRole> {
    return this.acpRoleRepository.create(props);
  }

  async createMany(props: DeepPartial<AcpRole>[]): Promise<AcpRole[]> {
    return this.acpRoleRepository.create(props);
  }
}
