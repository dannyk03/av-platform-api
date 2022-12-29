import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import { EnumGroupStatusCodeError } from '@avo/type';

import { plainToInstance } from 'class-transformer';
import { isNumber } from 'lodash';
import {
  Brackets,
  DataSource,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { GroupMember } from '../entity';

import { HelperStringService } from '@/utils/helper/service';

import { ConnectionNames } from '@/database/constant';

import { IPaginationOptions } from '@/utils/pagination';

import { CommonGroupsTransformRowQuery } from '../transform';

@Injectable()
export class GroupMemberService {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private readonly defaultDataSource: DataSource,
    @InjectRepository(GroupMember, ConnectionNames.Default)
    private readonly groupMemberRepository: Repository<GroupMember>,
    private readonly helperStringService: HelperStringService,
  ) {}

  async create(member: DeepPartial<GroupMember>): Promise<GroupMember> {
    return this.groupMemberRepository.create(member);
  }

  async createMany(
    members: DeepPartial<GroupMember>[],
  ): Promise<GroupMember[]> {
    return this.groupMemberRepository.create(members);
  }

  async save(member: DeepPartial<GroupMember>): Promise<GroupMember> {
    return this.groupMemberRepository.save(member);
  }

  async saveBulk(members: DeepPartial<GroupMember>[]): Promise<GroupMember[]> {
    return this.groupMemberRepository.save(members);
  }

  async find(find: FindManyOptions<GroupMember>): Promise<GroupMember[]> {
    return this.groupMemberRepository.find(find);
  }

  async findOne(find?: FindOneOptions<GroupMember>): Promise<GroupMember> {
    return this.groupMemberRepository.findOne({ ...find });
  }

  async findOneBy(find?: FindOptionsWhere<GroupMember>): Promise<GroupMember> {
    return this.groupMemberRepository.findOneBy({ ...find });
  }

  async findRandomGroupMembers({
    groupId,
    count,
    exclude,
  }: {
    groupId: string;
    count: number;
    exclude?: string[];
  }): Promise<GroupMember[]> {
    const builder = await this.groupMemberRepository
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.user', 'memberUser')
      .leftJoinAndSelect('memberUser.profile', 'userProfile')
      .leftJoinAndSelect('member.group', 'memberGroup')
      .select([
        'member.id',
        'member.role',
        'memberUser.id',
        'userProfile.firstName',
        'userProfile.lastName',
      ])
      .setParameters({ groupId, exclude })
      .where('memberGroup.id = :groupId')
      .andWhere('member.id NOT IN (:...exclude)')
      .orderBy('RANDOM()')
      .limit(count);

    return builder.getMany();
  }

  async findGroupMembers({
    groupId,
    options,
    search,
  }: {
    groupId: string;
    options: IPaginationOptions;
    search: string;
  }): Promise<GroupMember[]> {
    const builder = await this.groupMemberRepository
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.user', 'memberUser')
      .leftJoinAndSelect('memberUser.profile', 'userProfile')
      .leftJoinAndSelect('member.group', 'memberGroup')
      .select([
        'member.id',
        'member.role',
        'memberUser.id',
        'userProfile.firstName',
        'userProfile.lastName',
        'userProfile.personas',
      ])
      .setParameters({ groupId })
      .where('memberGroup.id = :groupId');

    if (options.order) {
      builder.orderBy(options.order);
    }

    if (isNumber(options.take) && isNumber(options.skip)) {
      builder.take(options.take).skip(options.skip);
    }

    if (search) {
      const formattedSearch = this.helperStringService.tsQueryParam(search);

      builder.andWhere(
        new Brackets((qb) => {
          qb.where(
            `to_tsvector('english', CONCAT_WS(' ', userProfile.firstName, userProfile.lastName)) @@ to_tsquery('english', :search)`,
            { search: `${formattedSearch}` },
          );
        }),
      );
    }
    return builder.getMany();
  }

  async findGroupMemberById(memberId: string): Promise<GroupMember> {
    const member = await this.groupMemberRepository.findOne({
      where: {
        id: memberId,
      },
      relations: [
        'user',
        'user.profile',
        'user.profile.home',
        'user.profile.shipping',
      ],
    });

    if (!member) {
      throw new UnprocessableEntityException({
        statusCode: EnumGroupStatusCodeError.GroupMemberNotFoundError,
        message: 'group.member.error.notFound',
      });
    }

    return member;
  }

  async findCommonGroups({
    user1Id,
    user2Id,
    options,
  }: {
    user1Id: string;
    user2Id: string;
    options?: { onlyCount: boolean };
  }): Promise<{ count: number } | CommonGroupsTransformRowQuery[]> {
    const onlyCount = options?.onlyCount ?? false;

    const res = await this.defaultDataSource.query(
      `
      ${
        onlyCount
          ? 'SELECT COUNT(id)'
          : 'SELECT id, created_at, name, is_active'
      }
        FROM (
          SELECT user1member.group_id AS group_id FROM
                (
                SELECT user_id, group_id FROM public.group_members WHERE user_id = $1 AND deleted_at IS NULL
                ) AS user1member
          INNER JOIN 
                (
                SELECT user_id, group_id FROM public.group_members WHERE user_id = $2 AND deleted_at IS NULL
                ) user2member
                ON user1member.group_id = user2member.group_id
          ) common_groups
          LEFT JOIN public.groups 
          ON group_id = id
      WHERE is_active = true AND deleted_at IS NULL
    `,
      [user1Id, user2Id],
    );

    return onlyCount
      ? res[0]
      : plainToInstance(CommonGroupsTransformRowQuery, res);
  }
}
