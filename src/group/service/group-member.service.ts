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
}
