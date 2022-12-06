import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EnumGroupInviteStatus } from '@avo/type';

import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';

import { GroupInviteMember } from '../entity';

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
    code,
    inviteStatus,
  }: {
    code: string;
    inviteStatus: EnumGroupInviteStatus;
  }): Promise<UpdateResult> {
    return this.groupInviteMemberRepository
      .createQueryBuilder()
      .update(GroupInviteMember)
      .set({ inviteStatus })
      .setParameters({ code })
      .where('code = :code')
      .execute();
  }
}
