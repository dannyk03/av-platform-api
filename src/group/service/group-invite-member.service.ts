import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EnumGroupInviteStatus } from '@avo/type';

import { isNumber } from 'class-validator';
import {
  Brackets,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';

import { GroupInviteMember } from '../entity';

import { EnumGroupInviteType, IGroupInviteSearch } from '../type';

import { ConnectionNames } from '@/database/constant';

@Injectable()
export class GroupInviteMemberService {
  constructor(
    @InjectRepository(GroupInviteMember, ConnectionNames.Default)
    private readonly groupInviteMemberRepository: Repository<GroupInviteMember>,
  ) {}

  async create(
    member: DeepPartial<GroupInviteMember>,
  ): Promise<GroupInviteMember> {
    return this.groupInviteMemberRepository.create(member);
  }

  async createMany(
    members: DeepPartial<GroupInviteMember>[],
  ): Promise<GroupInviteMember[]> {
    return this.groupInviteMemberRepository.create(members);
  }

  async save(
    member: DeepPartial<GroupInviteMember>,
  ): Promise<GroupInviteMember> {
    return this.groupInviteMemberRepository.save(member);
  }

  async saveBulk(
    members: DeepPartial<GroupInviteMember>[],
  ): Promise<GroupInviteMember[]> {
    return this.groupInviteMemberRepository.save(members);
  }

  async findOne(
    find?: FindOneOptions<GroupInviteMember>,
  ): Promise<GroupInviteMember> {
    return this.groupInviteMemberRepository.findOne({ ...find });
  }

  async find(
    find?: FindManyOptions<GroupInviteMember>,
  ): Promise<GroupInviteMember[]> {
    return this.groupInviteMemberRepository.find(find);
  }

  async findOneBy(
    find?: FindOptionsWhere<GroupInviteMember>,
  ): Promise<GroupInviteMember> {
    return this.groupInviteMemberRepository.findOneBy({ ...find });
  }

  async updateInviteStatus({
    inviteId,
    inviteStatus,
  }: {
    inviteId: string;
    inviteStatus: EnumGroupInviteStatus;
  }): Promise<UpdateResult> {
    return this.groupInviteMemberRepository
      .createQueryBuilder()
      .update(GroupInviteMember)
      .set({ inviteStatus })
      .setParameters({ inviteId })
      .where('id = :inviteId')
      .execute();
  }

  async getListSearchBuilder({
    search,
    status,
    type,
    userId,
  }: IGroupInviteSearch): Promise<SelectQueryBuilder<GroupInviteMember>> {
    const builder = this.groupInviteMemberRepository
      .createQueryBuilder('groupInviteMember')
      .leftJoinAndSelect('groupInviteMember.userInvity', 'userInvity')
      .leftJoinAndSelect('userInvity.profile', 'userInvityProfile')
      .leftJoinAndSelect('groupInviteMember.userInvitor', 'userInvitor')
      .leftJoinAndSelect('userInvitor.profile', 'userInvitorProfile')
      .select([
        'groupInviteMember',
        'userInvity.id',
        'userInvitor.id',
        'userInvitorProfile.firstName',
        'userInvitorProfile.lastName',
        'userInvityProfile.firstName',
        'userInvityProfile.lastName',
      ]);

    if (type.includes(EnumGroupInviteType.Incoming)) {
      console.log(11);
      builder.andWhere('userInvity.id = :userId', {
        userId,
      });
    }

    if (type.includes(EnumGroupInviteType.Outcoming)) {
      builder.andWhere('userInvitor.id = :userId', {
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
      builder.andWhere('userInvity.email ILIKE :likeSearch');
      builder.andWhere('userInvitor.email ILIKE :likeSearch');
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
  }: IGroupInviteSearch): Promise<GroupInviteMember[]> {
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
