import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import { plainToInstance } from 'class-transformer';
import {
  DataSource,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { GroupMember } from '../entity';

import { ConnectionNames } from '@/database/constant';

import { CommonGroupsTransformRowQuery } from '../transform';

@Injectable()
export class GroupMemberService {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private readonly defaultDataSource: DataSource,
    @InjectRepository(GroupMember, ConnectionNames.Default)
    private readonly groupMemberRepository: Repository<GroupMember>,
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
