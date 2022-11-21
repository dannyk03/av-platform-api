import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EnumGroupRole } from '@avo/type';

import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { GroupMember } from '../entity';

import { ConnectionNames } from '@/database/constant';

@Injectable()
export class GroupMemberService {
  constructor(
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

  async findOne(find?: FindOneOptions<GroupMember>): Promise<GroupMember> {
    return this.groupMemberRepository.findOne({ ...find });
  }

  async findOneBy(find?: FindOptionsWhere<GroupMember>): Promise<GroupMember> {
    return this.groupMemberRepository.findOneBy({ ...find });
  }

  async findRandomNonOwnerMembers({
    groupId,
    count,
  }: {
    groupId: string;
    count: number;
  }): Promise<GroupMember[]> {
    const xxx = await this.groupMemberRepository
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.user', 'memberUser')
      .leftJoinAndSelect('memberUser.profile', 'userProfile')
      .leftJoinAndSelect('member.group', 'memberGroup')
      .select([
        'member',
        'memberUser.email',
        'userProfile.firstName',
        'userProfile.lastName',
      ])
      .setParameters({ groupId })
      .where('member.role != :ownerRole', {
        ownerRole: EnumGroupRole.Owner,
      })
      .andWhere('memberGroup.id = :groupId')
      .orderBy('RANDOM()')
      .limit(count);

    console.log(xxx.getQueryAndParameters());
    return xxx.getMany();
  }
}
