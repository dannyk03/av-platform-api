import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeepPartial, FindOneOptions, Repository } from 'typeorm';

import { User, UserProfile } from '../entity';

import { ConnectionNames } from '@/database';

@Injectable()
export class UserProfileService {
  private readonly uploadPath: string;

  constructor(
    @InjectRepository(User, ConnectionNames.Default)
    private userProfileRepository: Repository<UserProfile>,
  ) {}

  async create(props: DeepPartial<UserProfile>): Promise<UserProfile> {
    return this.userProfileRepository.create(props);
  }

  async save(user: UserProfile): Promise<UserProfile> {
    return this.userProfileRepository.save<UserProfile>(user);
  }

  async findOne(find: FindOneOptions<UserProfile>): Promise<UserProfile> {
    return this.userProfileRepository.findOne(find);
  }
}
