import { ConnectionNames } from '@/database';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
// Entities
import { OrganizationInvite } from '../entity/organization-invite.entity';
//

@Injectable()
export class OrganizationInviteService {
  constructor(
    @InjectRepository(OrganizationInvite, ConnectionNames.Default)
    private organizationInviteRepository: Repository<OrganizationInvite>,
  ) {}

  async create(
    props: DeepPartial<OrganizationInvite>,
  ): Promise<OrganizationInvite> {
    return this.organizationInviteRepository.create(props);
  }

  async save(props: OrganizationInvite): Promise<OrganizationInvite> {
    return this.organizationInviteRepository.save(props);
  }

  async findOneBy(
    find: FindOptionsWhere<OrganizationInvite>,
  ): Promise<OrganizationInvite> {
    return this.organizationInviteRepository.findOneBy(find);
  }
}
