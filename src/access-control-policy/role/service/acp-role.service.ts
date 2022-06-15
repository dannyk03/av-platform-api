import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConnectionNames } from '@/database';
import { AcpRole } from '../entity/acp-role.entity';

@Injectable()
export class AcpRoleService {
  constructor(
    // @InjectRepository(AcpRole, ConnectionNames.Default)
    private acpRoleRepository: Repository<AcpRole>,
    private readonly configService: ConfigService,
  ) {}
}
