import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
// Entities
import { DisplayLanguage } from '../entity';
// Services
import { DebuggerService } from '@/debugger/service';
//
import { ConnectionNames } from '@/database';

@Injectable()
export class DisplayLanguageService {
  constructor(
    @InjectRepository(DisplayLanguage, ConnectionNames.Default)
    private displayLanguageRepository: Repository<DisplayLanguage>,
    private readonly configService: ConfigService,
    private readonly debuggerService: DebuggerService,
  ) {}

  async create(props: DeepPartial<DisplayLanguage>): Promise<DisplayLanguage> {
    return this.displayLanguageRepository.create(props);
  }

  async save(data: DisplayLanguage): Promise<DisplayLanguage> {
    return this.displayLanguageRepository.save<DisplayLanguage>(data);
  }

  async findOneBy(
    find: FindOptionsWhere<DisplayLanguage>,
  ): Promise<DisplayLanguage> {
    return this.displayLanguageRepository.findOneBy(find);
  }

  async findOne(
    find: FindOneOptions<DisplayLanguage>,
  ): Promise<DisplayLanguage> {
    return this.displayLanguageRepository.findOne(find);
  }
}
