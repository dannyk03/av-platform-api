import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeepPartial, Repository } from 'typeorm';

import { AclSubject } from '../entity';

import { ConnectionNames } from '@/database/constants';

@Injectable()
export class AclSubjectService {
  constructor(
    @InjectRepository(AclSubject, ConnectionNames.Default)
    private aclSubjectRepository: Repository<AclSubject>,
  ) {}

  async create(props: DeepPartial<AclSubject>): Promise<AclSubject> {
    return this.aclSubjectRepository.create(props);
  }

  async createMany(props: DeepPartial<AclSubject>[]): Promise<AclSubject[]> {
    return this.aclSubjectRepository.create(props);
  }
}
