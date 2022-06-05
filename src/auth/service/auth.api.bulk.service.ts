/* istanbul ignore file */

import { Injectable } from '@nestjs/common';
import { AuthApiEntity } from '../entity/auth.api.entity';
import { ConnectionNames } from '@/database';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthApiBulkService {
  constructor(
    @InjectRepository(AuthApiEntity, ConnectionNames.Master)
    private authapiRepository: Repository<AuthApiEntity>,
  ) {}

  async deleteMany(find: Record<string, any>) {
    // return this.authapiRepository.deleteMany(find);
  }
}
