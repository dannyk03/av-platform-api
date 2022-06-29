import { ConnectionNames } from '@/database';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
// Entities
import { UserInvite } from '../entity/user-invite.entity';
//

@Injectable()
export class UserInviteService {
  constructor(
    @InjectRepository(UserInvite, ConnectionNames.Default)
    private userInviteRepository: Repository<UserInvite>,
  ) {}

  async create(props: DeepPartial<UserInvite>): Promise<UserInvite> {
    return this.userInviteRepository.create(props);
  }

  async save(props: UserInvite): Promise<UserInvite> {
    return this.userInviteRepository.save(props);
  }

  async findOneBy(find: FindOptionsWhere<UserInvite>): Promise<UserInvite> {
    return this.userInviteRepository.findOneBy(find);
  }
}
