import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeepPartial, FindOneOptions, Repository } from 'typeorm';

import { UserProfileCompany } from '../entity';

import { ConnectionNames } from '@/database/constant';

@Injectable()
export class UserProfileCompanyService {
  constructor(
    @InjectRepository(UserProfileCompany, ConnectionNames.Default)
    private userProfileCompanyRepository: Repository<UserProfileCompany>,
  ) {}

  async create(
    props: DeepPartial<UserProfileCompany>,
  ): Promise<UserProfileCompany> {
    return this.userProfileCompanyRepository.create(props);
  }

  async save(user: UserProfileCompany): Promise<UserProfileCompany> {
    return this.userProfileCompanyRepository.save<UserProfileCompany>(user);
  }

  async findOne(
    find: FindOneOptions<UserProfileCompany>,
  ): Promise<UserProfileCompany> {
    return this.userProfileCompanyRepository.findOne(find);
  }
}
