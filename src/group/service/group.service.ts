import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EnumGroupStatusCodeError } from '@avo/type';

import { isNumber } from 'class-validator';
import {
  Brackets,
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';

import { Group } from '../entity';

import { HelperSlugService } from '@/utils/helper/service';

import { IGroupSearch } from '../type';

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

  async getListSearchBuilder({
    userId,
    search,
    isActive,
  }: IGroupSearch): Promise<SelectQueryBuilder<Group>> {
    const builder = this.groupRepository
      .createQueryBuilder('group')
      .setParameters({ isActive, userId })
      .leftJoinAndSelect('group.users', 'user')
      .where('group.isActive = ANY(:isActive)')
      .andWhere('user.id = :userId');

    if (search) {
      builder.andWhere(
        new Brackets((qb) => {
          builder.setParameters({ search, likeSearch: `%${search}%` });
          qb.where('group.name ILIKE :likeSearch').orWhere(
            'group.description ILIKE :likeSearch',
          );
        }),
      );
    }

    return builder;
  }

  async paginatedSearchBy({
    userId,
    search,
    isActive,
    options,
  }: IGroupSearch): Promise<Group[]> {
    const searchBuilder = await this.getListSearchBuilder({
      userId,
      search,
      isActive,
    });

    if (options.order) {
      searchBuilder.orderBy(options.order);
    }

    if (isNumber(options.take) && isNumber(options.skip)) {
      searchBuilder.take(options.take).skip(options.skip);
    }

    return searchBuilder.getMany();
  }

  async getTotal({ userId, search, isActive }: IGroupSearch): Promise<number> {
    const searchBuilder = await this.getListSearchBuilder({
      userId,
      search,
      isActive,
    });

    return searchBuilder.getCount();
  }
}
