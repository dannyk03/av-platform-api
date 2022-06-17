import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { ConnectionNames } from '@/database';
import { Organization } from '../entity/organization.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization, ConnectionNames.Default)
    private organizationRepository: Repository<Organization>,
    private readonly configService: ConfigService,
  ) {}

  create(props: DeepPartial<Organization>): Organization {
    return this.organizationRepository.create(props);
  }

  createMany(props: DeepPartial<Organization>[]): Organization[] {
    return this.organizationRepository.create(props);
  }
}
