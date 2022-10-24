import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { InvitationLink } from '../entity';

import { ConnectionNames } from '@/database/constant';

@Injectable()
export class InvitationLinkService {
  constructor(
    @InjectRepository(InvitationLink, ConnectionNames.Default)
    private invitationLinkRepository: Repository<InvitationLink>,
  ) {}

  async create(props: DeepPartial<InvitationLink>): Promise<InvitationLink> {
    return this.invitationLinkRepository.create(props);
  }

  async createMany(
    props: DeepPartial<InvitationLink>[],
  ): Promise<InvitationLink[]> {
    return this.invitationLinkRepository.create(props);
  }

  async save(entity: InvitationLink): Promise<InvitationLink> {
    return this.invitationLinkRepository.save<InvitationLink>(entity);
  }

  async saveMany(entities: InvitationLink[]): Promise<InvitationLink[]> {
    return this.invitationLinkRepository.save(entities);
  }

  async findOne(find: FindOneOptions<InvitationLink>): Promise<InvitationLink> {
    return this.invitationLinkRepository.findOne(find);
  }

  async find(find: FindManyOptions<InvitationLink>): Promise<InvitationLink[]> {
    return this.invitationLinkRepository.find(find);
  }

  async findOneBy(
    find: FindOptionsWhere<InvitationLink> | FindOptionsWhere<InvitationLink>[],
  ): Promise<InvitationLink> {
    return this.invitationLinkRepository.findOneBy(find);
  }

  async findOneById(
    id: string,
    options?: Record<string, any>,
  ): Promise<InvitationLink> {
    return this.invitationLinkRepository.findOne({
      where: { id },
      relations: options?.relations,
      select: options?.select,
    });
  }
}
