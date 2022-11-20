import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EnumGroupStatusCodeError } from '@avo/type';

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

  async createMany(props: DeepPartial<Group>[]): Promise<Group[]> {
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
    const findOne = await this.groupRepository
      .createQueryBuilder('group')
      .select(['group.id'])
      .where('LOWER(name) = LOWER(:name)', { name })
      .getOne();

    return Boolean(findOne);
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

  async removeGroupBy(find: FindOptionsWhere<Group>): Promise<Group> {
    const findGroup = await this.groupRepository.findOne({
      where: find,
    });

    if (!findGroup) {
      throw new NotFoundException({
        statusCode: EnumGroupStatusCodeError.GroupNotFoundError,
        message: 'group.error.notFound',
      });
    }

    return this.groupRepository.remove(findGroup);
  }
}
