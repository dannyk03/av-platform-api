/* istanbul ignore file */

import { Injectable } from '@nestjs/common';
import { AuthApi } from '../entity/auth.api.entity';
import { ConnectionNames } from '@/database';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthApiBulkService {
  constructor(
    @InjectRepository(AuthApi, ConnectionNames.Default)
    private authapiRepository: Repository<AuthApi>,
  ) {}

  async deleteMany(find: Record<string, any>) {
    // return this.authapiRepository.deleteMany(find);
  }
}
