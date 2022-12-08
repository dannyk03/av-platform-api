import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EnumGroupInviteStatus } from '@avo/type';

import { isNumber } from 'class-validator';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';

import { GroupInviteMemberLink } from '../entity';

import { EnumGroupInviteType, IGroupInviteSearch } from '../type';

import { ConnectionNames } from '@/database/constant';

@Injectable()
export class GroupInviteMemberLinkService {
  constructor(
    @InjectRepository(GroupInviteMemberLink, ConnectionNames.Default)
    private readonly groupInviteMemberLinkRepository: Repository<GroupInviteMemberLink>,
  ) {}

  async create(
    member: DeepPartial<GroupInviteMemberLink>,
  ): Promise<GroupInviteMemberLink> {
    return this.groupInviteMemberLinkRepository.create(member);
  }

  async createMany(
    members: DeepPartial<GroupInviteMemberLink>[],
  ): Promise<GroupInviteMemberLink[]> {
    return this.groupInviteMemberLinkRepository.create(members);
  }

  async save(
    member: DeepPartial<GroupInviteMemberLink>,
  ): Promise<GroupInviteMemberLink> {
    return this.groupInviteMemberLinkRepository.save(member);
  }

  async saveBulk(
    members: DeepPartial<GroupInviteMemberLink>[],
  ): Promise<GroupInviteMemberLink[]> {
    return this.groupInviteMemberLinkRepository.save(members);
  }

  async findOne(
    find?: FindOneOptions<GroupInviteMemberLink>,
  ): Promise<GroupInviteMemberLink> {
    return this.groupInviteMemberLinkRepository.findOne({ ...find });
  }

  async find(
    find?: FindManyOptions<GroupInviteMemberLink>,
  ): Promise<GroupInviteMemberLink[]> {
    return this.groupInviteMemberLinkRepository.find(find);
  }

  async findOneBy(
    find?: FindOptionsWhere<GroupInviteMemberLink>,
  ): Promise<GroupInviteMemberLink> {
    return this.groupInviteMemberLinkRepository.findOneBy({ ...find });
  }

  async updateInviteStatus({
    inviteId,
    inviteStatus,
  }: {
    inviteId: string;
    inviteStatus: EnumGroupInviteStatus;
  }): Promise<UpdateResult> {
    return this.groupInviteMemberLinkRepository
      .createQueryBuilder()
      .update(GroupInviteMemberLink)
      .set({ status: inviteStatus })
      .setParameters({ inviteId })
      .where('id = :inviteId')
      .execute();
  }

  async getListSearchBuilder({
    search,
    status,
    type,
    userId,
  }: IGroupInviteSearch): Promise<SelectQueryBuilder<GroupInviteMemberLink>> {
    const builder = this.groupInviteMemberLinkRepository
      .createQueryBuilder('groupInviteMember')
      .leftJoinAndSelect('groupInviteMember.inviteeUser', 'inviteeUser')
      .leftJoinAndSelect('inviteeUser.profile', 'inviteeUserProfile')
      .leftJoinAndSelect('groupInviteMember.inviterUser', 'inviterUser')
      .leftJoinAndSelect('inviterUser.profile', 'inviterUserProfile')
      .select([
        'groupInviteMember.id',
        'groupInviteMember.role',
        'groupInviteMember.expiresAt',
        'groupInviteMember.createdAt',
        'inviteeUser.id',
        'inviterUser.id',
        'inviterUserProfile.firstName',
        'inviterUserProfile.lastName',
        'inviteeUserProfile.firstName',
        'inviteeUserProfile.lastName',
      ]);

    if (type.includes(EnumGroupInviteType.Income)) {
      builder.andWhere('inviteeUser.id = :userId', {
        userId,
      });
    }

    if (type.includes(EnumGroupInviteType.Outcome)) {
      builder.andWhere('inviterUser.id = :userId', {
        userId,
      });
    }

    if (status?.length) {
      builder.andWhere('groupInviteMember.inviteStatus = ANY(:status)', {
        status,
      });
    }

    if (search) {
      builder.setParameters({ search, likeSearch: `%${search}%` });
      builder.andWhere('inviteeUser.email ILIKE :likeSearch');
      builder.andWhere('inviterUser.email ILIKE :likeSearch');
    }

    return builder;
  }

  async getTotal({
    status,
    search,
    type,
    userId,
  }: IGroupInviteSearch): Promise<number> {
    const searchBuilder = await this.getListSearchBuilder({
      search,
      status,
      type,
      userId,
    });

    return searchBuilder.getCount();
  }

  async paginatedSearchBy({
    status = EnumGroupInviteStatus.Pending,
    search,
    options,
    type,
    userId,
  }: IGroupInviteSearch): Promise<GroupInviteMemberLink[]> {
    const searchBuilder = await this.getListSearchBuilder({
      search,
      status,
      type,
      userId,
    });

    if (options.order) {
      searchBuilder.orderBy(options.order);
    }

    if (isNumber(options.take) && isNumber(options.skip)) {
      searchBuilder.take(options.take).skip(options.skip);
    }
    return searchBuilder.getMany();
  }
}
