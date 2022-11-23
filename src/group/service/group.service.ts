import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EnumGroupRole, EnumGroupStatusCodeError } from '@avo/type';

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

import { IGroupSearch } from '../type';

import { ConnectionNames } from '@/database/constant';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group, ConnectionNames.Default)
    private readonly groupRepository: Repository<Group>,
  ) {}

  async create(props: DeepPartial<Group>): Promise<Group> {
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

  async findGroup({
    groupId,
    userId,
    isOwner = false,
  }: {
    userId: string;
    groupId: string;
    isOwner?: boolean;
  }): Promise<Group> {
    return this.findOne({
      where: {
        id: groupId,
        members: {
          ...(isOwner ? { role: EnumGroupRole.Owner } : null),
          user: {
            id: userId,
          },
        },
      },
      relations: {
        members: {
          user: true,
        },
      },
      select: {
        id: true,
        members: {
          role: true,
          user: {
            id: true,
          },
        },
      },
    });
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
    const groupQueryBuilder = this.groupRepository.createQueryBuilder('group');

    const builder = groupQueryBuilder
      .setParameters({ isActive, userId })
      .leftJoinAndSelect('group.members', 'member')
      .leftJoinAndSelect('member.user', 'user')
      .leftJoinAndSelect('user.profile', 'userProfile')
      .select([
        'group',
        'member.id',
        'member.role',
        'user.email',
        'userProfile.firstName',
        'userProfile.lastName',
      ])
      .loadRelationCountAndMap('group.membersCount', 'group.members')
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

  async getUpcomingMilestones({
    groupId,
    fromTimestamp,
    toTimestamp,
  }: {
    groupId: string;
    fromTimestamp: number;
    toTimestamp: number;
  }) {
    return this.groupRepository
      .createQueryBuilder('group')
      .setParameters({ groupId, fromTimestamp, toTimestamp })
      .leftJoinAndSelect('group.members', 'member')
      .leftJoinAndSelect('member.user', 'user')
      .leftJoinAndSelect('user.profile', 'userProfile')
      .select([
        'group',
        'member.id',
        'member.role',
        'user.email',
        'userProfile.firstName',
        'userProfile.lastName',
        'userProfile.birthMonth',
        'userProfile.birthDay',
        'userProfile.workAnniversaryMonth',
        'userProfile.workAnniversaryDay',
      ])
      .where('group.id = :groupId')
      .getMany();
  }
}
