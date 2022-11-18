import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';

import { Group } from '../entity';

import { HelperSlugService } from '@/utils/helper/service';

import { ConnectionNames } from '@/database/constant';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group, ConnectionNames.Default)
    private readonly groupRepository: Repository<Group>,
    private readonly slugService: HelperSlugService,
  ) {}

  async create(props: DeepPartial<Omit<Group, 'slug'>>): Promise<Group> {
    return this.groupRepository.create(props);
  }

  async createMany(
    props: DeepPartial<Omit<Group, 'slug'>>[],
  ): Promise<Group[]> {
    return this.groupRepository.create(props);
  }

  async save(props: DeepPartial<Group>): Promise<Group> {
    return this.groupRepository.save(props);
  }

  async saveBulk(props: DeepPartial<Group>[]): Promise<Group[]> {
    return this.groupRepository.save(props);
  }

  async findOne(find?: FindOneOptions<Group>): Promise<Group> {
    return this.groupRepository.findOne({ ...find });
  }

  async findOneBy(find?: FindOptionsWhere<Group>): Promise<Group> {
    return this.groupRepository.findOneBy({ ...find });
  }

  async checkExistsByName(name: string): Promise<boolean> {
    const exists = await this.groupRepository.findOne({
      where: { slug: this.slugService.slugify(name) },
      select: {
        id: true,
      },
    });

    return Boolean(exists);
  }

  async updateGroupActiveStatus({
    id,
    isActive,
  }: {
    id: string;
    isActive: boolean;
  }): Promise<UpdateResult> {
    return this.groupRepository
      .createQueryBuilder()
      .update(Group)
      .set({ isActive })
      .where('id = :id', { id })
      .andWhere('isActive != :isActive', { isActive })
      .execute();
  }
}
