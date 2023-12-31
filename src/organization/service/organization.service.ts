import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { Organization } from '../entity';

import { HelperSlugService } from '@/utils/helper/service';

import { ConnectionNames } from '@/database/constant';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization, ConnectionNames.Default)
    private readonly organizationRepository: Repository<Organization>,
    private readonly slugService: HelperSlugService,
  ) {}

  async create(
    props: DeepPartial<Omit<Organization, 'slug'>>,
  ): Promise<Organization> {
    return this.organizationRepository.create(props);
  }

  async createMany(
    props: DeepPartial<Omit<Organization, 'slug'>>[],
  ): Promise<Organization[]> {
    return this.organizationRepository.create(props);
  }

  async findOne(find?: FindOneOptions<Organization>): Promise<Organization> {
    return this.organizationRepository.findOne({ ...find });
  }

  async findOneBy(
    find?: FindOptionsWhere<Organization>,
  ): Promise<Organization> {
    return this.organizationRepository.findOneBy({ ...find });
  }

  async checkExistsByName(name: string): Promise<boolean> {
    const exists = await this.organizationRepository.findOne({
      where: { slug: this.slugService.slugify(name) },
      select: {
        id: true,
      },
    });

    return Boolean(exists);
  }
}
