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

  async create(props: DeepPartial<GroupMember>): Promise<GroupMember> {
    return this.groupMemberRepository.create(props);
  }

  async createMany(props: DeepPartial<GroupMember>[]): Promise<GroupMember[]> {
    return this.groupMemberRepository.create(props);
  }

  async save(props: DeepPartial<GroupMember>): Promise<GroupMember> {
    return this.groupMemberRepository.save(props);
  }

  async saveBulk(props: DeepPartial<GroupMember>[]): Promise<GroupMember[]> {
    return this.groupMemberRepository.save(props);
  }

  async findOne(find?: FindOneOptions<GroupMember>): Promise<GroupMember> {
    return this.groupMemberRepository.findOne({ ...find });
  }

  async findOneBy(find?: FindOptionsWhere<GroupMember>): Promise<GroupMember> {
    return this.groupMemberRepository.findOneBy({ ...find });
  }
}
