import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { ConnectionNames } from '@/database';
import { Organization } from '../entity/organization.entity';
import { HelperSlugService } from '@/utils/helper';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization, ConnectionNames.Default)
    private readonly organizationRepository: Repository<Organization>,
    private readonly slugService: HelperSlugService,
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
      where: { slug: this.slugService.slugify(name) },
    });

    return Boolean(exists);
  }
}
