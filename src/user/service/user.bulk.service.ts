import { ConnectionNames } from '@/database';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';

import { User } from '../entity/user.entity';

@Injectable()
export class UserBulkService {
  constructor(
    // @InjectRepository(User, ConnectionNames.Default)
    private userRepository: Repository<User>,
  ) {}

  async deleteMany(find: Record<string, any>): Promise<DeleteResult | any> {
    // return this.userRepository.deleteMany(find);
  }
}
