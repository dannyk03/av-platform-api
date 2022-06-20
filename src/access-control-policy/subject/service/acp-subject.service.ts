import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { ConnectionNames } from '@/database';
import { AcpSubject } from '../entity/acp-subject.entity';

@Injectable()
export class AcpSubjectService {
  constructor(
    @InjectRepository(AcpSubject, ConnectionNames.Default)
    private acpSubjectRepository: Repository<AcpSubject>,
    private readonly configService: ConfigService,
  ) {}

  create(props: DeepPartial<AcpSubject>): AcpSubject {
    return this.acpSubjectRepository.create(props);
  }

  createMany(props: DeepPartial<AcpSubject>[]): AcpSubject[] {
    return this.acpSubjectRepository.create(props);
  }
}