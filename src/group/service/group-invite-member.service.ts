import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { GroupInviteMemberLink } from '../entity';

import { ConnectionNames } from '@/database/constant';

@Injectable()
export class GroupInviteMemberService {
  constructor(
    @InjectRepository(GroupInviteMemberLink, ConnectionNames.Default)
    private readonly groupInviteMemberRepository: Repository<GroupInviteMemberLink>,
  ) {}

  async create(
    member: DeepPartial<GroupInviteMemberLink>,
  ): Promise<GroupInviteMemberLink> {
    return this.groupInviteMemberRepository.create(member);
  }

  async createMany(
    members: DeepPartial<GroupInviteMemberLink>[],
  ): Promise<GroupInviteMemberLink[]> {
    return this.groupInviteMemberRepository.create(members);
  }

  async save(
    member: DeepPartial<GroupInviteMemberLink>,
  ): Promise<GroupInviteMemberLink> {
    return this.groupInviteMemberRepository.save(member);
  }

  async saveBulk(
    members: DeepPartial<GroupInviteMemberLink>[],
  ): Promise<GroupInviteMemberLink[]> {
    return this.groupInviteMemberRepository.save(members);
  }

  async findOne(
    find?: FindOneOptions<GroupInviteMemberLink>,
  ): Promise<GroupInviteMemberLink> {
    return this.groupInviteMemberRepository.findOne({ ...find });
  }

  async findOneBy(
    find?: FindOptionsWhere<GroupInviteMemberLink>,
  ): Promise<GroupInviteMemberLink> {
    return this.groupInviteMemberRepository.findOneBy({ ...find });
  }
}
