import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConnectionNames } from '@/database';
import { Organization } from '../entity/organization.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization, ConnectionNames.Default)
    private acpRoleRepository: Repository<Organization>,
    private readonly configService: ConfigService,
  ) {}
}
