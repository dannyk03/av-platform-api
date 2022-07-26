import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { ConnectionNames } from '@/database';
import { HelperSlugService } from '@/utils/helper/service';

import { Organization } from '../entity';

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

  async findOne(find?: FindOneOptions<Organization>): Promise<Organization> {
    return this.organizationRepository.findOne({ ...find });
  }

  async findBy(find?: FindOptionsWhere<Organization>): Promise<Organization[]> {
    return this.organizationRepository.findBy({ ...find });
  }

  async checkExistsByName(name: string): Promise<boolean> {
    const exists = await this.organizationRepository.findOne({
      where: { slug: this.slugService.slugify(name) },
    });

    return Boolean(exists);
  }
}
