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

  async create(props: DeepPartial<Organization>): Promise<Organization> {
    return this.organizationRepository.create(props);
  }

  async createMany(
    props: DeepPartial<Organization>[],
  ): Promise<Organization[]> {
    return this.organizationRepository.create(props);
  }

  async checkExistByName(name: string): Promise<boolean> {
    const exists = await this.organizationRepository.findOne({
      where: { name },
    });

    return Boolean(exists);
  }
}
