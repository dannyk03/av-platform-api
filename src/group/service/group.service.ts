import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import {
  EnumGroupRole,
  EnumGroupStatusCodeError,
  EnumGroupUpcomingMilestoneType,
} from '@avo/type';

import { isNumber } from 'class-validator';
import {
  Brackets,
  DataSource,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';

import { Group } from '@/group/entity';

import { GroupMemberService } from '@/group/service/group-member.service';
import { HelperStringService } from '@/utils/helper/service';

import { IGroupSearch } from '@/group/type';

import { ConnectionNames } from '@/database/constant';

import { CommonGroupsTransformRowQuery } from '../transform';

@Injectable()
export class GroupService {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private readonly defaultDataSource: DataSource,
    @InjectRepository(Group, ConnectionNames.Default)
    private readonly groupRepository: Repository<Group>,
    private readonly helperStringService: HelperStringService,
    private readonly groupMemberService: GroupMemberService,
  ) {}

  async findCommonGroups({
    user1Id,
    user2Id,
    options,
  }: {
    user1Id: string;
    user2Id: string;
    options?: { onlyCount: boolean };
  }): Promise<{ count: number } | CommonGroupsTransformRowQuery[]> {
    const onlyCount = options?.onlyCount ?? true;
    return this.groupMemberService.findCommonGroups({
      user1Id,
      user2Id,
      options: { onlyCount },
    });
  }

  private async getNotEmptyArrayOfSomethingFromUserProfile({
    groupId,
    column,
    skip = 0,
    limit = 0,
  }: {
    column: 'desiredSkills' | 'funFacts';
    skip: number;
    limit: number;
    groupId: string;
  }): Promise<any[]> {
    const LIMIT = limit || 'ALL';
    const OFFSET = skip;

    return this.defaultDataSource.query(
      `
      SELECT u.email, up.first_name, up.last_name, up.${snakeCase(
        column,
      )}, up.created_at FROM public.groups AS g
      LEFT JOIN public.group_members AS m
                  ON g.id = m.group_id
      LEFT JOIN public.users AS u
                  ON m.user_id = u.id
      LEFT JOIN public.user_profiles AS up
                  ON up.user_id = u.id
      WHERE g.id = $1 AND cardinality(up.${snakeCase(
        column,
      )}) > 0 AND g.deleted_at IS NULL AND u.deleted_at IS NULL AND m.deleted_at IS NULL AND up.deleted_at IS NULL
      ORDER BY up.created_at
      LIMIT ${LIMIT} OFFSET ${OFFSET}
    `,
      [groupId],
    );
  }

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

  async find(find: FindManyOptions<Group>): Promise<Group[]> {
    return this.groupRepository.find(find);
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
        name: true,
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
        'user.id',
        'userProfile.firstName',
        'userProfile.lastName',
      ])
      .loadRelationCountAndMap('group.membersCount', 'group.members')
      .where('group.isActive = ANY(:isActive)')
      .andWhere('user.id = :userId');

    if (search) {
      const formattedSearch = this.helperStringService.tsQueryParam(search);

      builder.andWhere(
        new Brackets((qb) => {
          qb.where(
            `to_tsvector('english', CONCAT_WS(' ', group.name, group.description)) @@ to_tsquery('english', :search)`,
            { search: `${formattedSearch}` },
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

  async getDesiredSkills({
    groupId,
    skip = 0,
    limit = 0,
  }: {
    groupId: string;
    skip: number;
    limit: number;
  }): Promise<any[]> {
    return this.getNotEmptyArrayOfSomethingFromUserProfile({
      column: 'desiredSkills',
      groupId,
      skip,
      limit,
    });
  }

  async getFunFacts({
    groupId,
    skip = 0,
    limit = 0,
  }: {
    groupId: string;
    skip: number;
    limit: number;
  }): Promise<any[]> {
    return this.getNotEmptyArrayOfSomethingFromUserProfile({
      column: 'funFacts',
      groupId,
      skip,
      limit,
    });
  }

  async getUpcomingMilestones({
    groupId,
    days = 60,
    skip = 0,
    limit = 0,
  }: {
    groupId: string;
    days: number;
    skip: number;
    limit: number;
  }): Promise<any[]> {
    const LIMIT = limit || 'ALL';
    const OFFSET = skip;

    return this.defaultDataSource.query(
      `
      SELECT role, user_id, profile_id, email, first_name, last_name, CAST(e_day AS INT) AS day, CAST(e_month AS INT) AS month,  CAST(e_year AS INT) AS year, e_date AS date, e_type AS type, u_created_at AS created_at
      FROM
      (
        SELECT role, user_id, profile_id, email, first_name, last_name, e_day, e_month, e_type, e_year, make_date(CAST(e_year AS INT), CAST(e_month AS INT), CAST(e_day AS INT)) AS e_date, u_created_at
        FROM
        (
          SELECT m.role, m.user_id, u.email, u.created_at AS u_created_at, up.id AS profile_id,
          up.first_name, up.last_name, up.birth_day AS e_day, up.birth_month AS e_month, upcoming_event_year(CAST(up.birth_day AS INT), CAST(up.birth_month AS INT)) AS e_year, '${EnumGroupUpcomingMilestoneType.Birthday}' AS e_type
          FROM public.groups AS g
            LEFT JOIN public.group_members AS m
              ON g.id = m.group_id
            LEFT JOIN public.users AS u
              ON m.user_id = u.id
            LEFT JOIN public.user_profiles AS up
              ON up.user_id = u.id
          WHERE g.id = $1 AND up.birth_day IS NOT NULL AND up.birth_month IS NOT NULL AND g.deleted_at IS NULL AND u.deleted_at IS NULL AND m.deleted_at IS NULL AND up.deleted_at IS NULL
          UNION
          SELECT m.role, m.user_id, u.email, u.created_at AS u_created_at, up.id AS profile_id,
            up.first_name, up.last_name, up.work_anniversary_day AS e_day,
            up.work_anniversary_month AS e_month, upcoming_event_year(CAST(up.work_anniversary_day AS INT), CAST(up.work_anniversary_month AS INT)) AS e_year, '${EnumGroupUpcomingMilestoneType.WorkAnniversary}' AS e_type
          FROM public.groups AS g
            LEFT JOIN public.group_members AS m
              ON g.id = m.group_id
            LEFT JOIN public.users AS u
              ON m.user_id = u.id
            LEFT JOIN public.user_profiles AS up
              ON up.user_id = u.id
          WHERE g.id = $1 AND up.work_anniversary_day IS NOT NULL AND up.work_anniversary_month IS NOT NULL AND g.deleted_at IS NULL AND u.deleted_at IS NULL AND m.deleted_at IS NULL AND up.deleted_at IS NULL
        ) AS temp_events
      ) AS events
      WHERE e_date <= NOW() + ($2 || 'DAY')::INTERVAL
      ORDER BY e_date
      LIMIT ${LIMIT} OFFSET ${OFFSET}
    `,
      [groupId, days],
    );
  }
}
