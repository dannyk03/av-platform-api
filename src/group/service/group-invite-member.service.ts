import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
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

  async findOneBy(
    find?: FindOptionsWhere<GroupInviteMember>,
  ): Promise<GroupInviteMember> {
    return this.groupInviteMemberRepository.findOneBy({ ...find });
  }
}
