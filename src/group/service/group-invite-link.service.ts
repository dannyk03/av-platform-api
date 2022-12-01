import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { GroupInviteLink } from '../entity';

import { ConnectionNames } from '@/database/constant';

@Injectable()
export class GroupInviteLinkService {
  constructor(
    @InjectRepository(GroupInviteLink, ConnectionNames.Default)
    private readonly groupInviteLinkRepository: Repository<GroupInviteLink>,
  ) {}

  async create(props: DeepPartial<GroupInviteLink>): Promise<GroupInviteLink> {
    return this.groupInviteLinkRepository.create(props);
  }

  async createMany(
    props: DeepPartial<GroupInviteLink>[],
  ): Promise<GroupInviteLink[]> {
    return this.groupInviteLinkRepository.create(props);
  }

  async save(props: DeepPartial<GroupInviteLink>): Promise<GroupInviteLink> {
    return this.groupInviteLinkRepository.save(props);
  }

  async saveBulk(
    props: DeepPartial<GroupInviteLink>[],
  ): Promise<GroupInviteLink[]> {
    return this.groupInviteLinkRepository.save(props);
  }

  async findOne(
    find?: FindOneOptions<GroupInviteLink>,
  ): Promise<GroupInviteLink> {
    return this.groupInviteLinkRepository.findOne({ ...find });
  }

  async findOneBy(
    find?: FindOptionsWhere<GroupInviteLink>,
  ): Promise<GroupInviteLink> {
    return this.groupInviteLinkRepository.findOneBy({ ...find });
  }
}
