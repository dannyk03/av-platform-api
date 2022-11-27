import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

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
        'memberUser.email',
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
}
