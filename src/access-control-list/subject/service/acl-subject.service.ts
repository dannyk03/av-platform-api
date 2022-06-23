import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { ConnectionNames } from '@/database';
import { AclSubject } from '../entity/acl-subject.entity';

@Injectable()
export class AclSubjectService {
  constructor(
    @InjectRepository(AclSubject, ConnectionNames.Default)
    private aclSubjectRepository: Repository<AclSubject>,
    private readonly configService: ConfigService,
  ) {}

  async create(props: DeepPartial<AclSubject>): Promise<AclSubject> {
    return this.aclSubjectRepository.create(props);
  }

  async createMany(props: DeepPartial<AclSubject>[]): Promise<AclSubject[]> {
    return this.aclSubjectRepository.create(props);
  }
}
