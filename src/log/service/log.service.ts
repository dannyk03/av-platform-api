import { Injectable } from '@nestjs/common';
import { ILog } from '../log.interface';
import { EnumLoggerLevel } from '../log.constant';
import { Log } from '../entity/log.entity';
import { ConnectionNames } from '@/database';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(Log, ConnectionNames.Default)
    private logRepository: Repository<Log>,
  ) {}

  async info({
    correlationId,
    action,
    description,
    user,
    tags,
    userAgent,
    method,
    originalUrl,
  }: ILog): Promise<any> {
    const create = this.logRepository.create({
      level: EnumLoggerLevel.Info,
      user: user,
      correlationId,
      action,
      description,
      tags,
      userAgent,
      method,
      originalUrl,
    });
    return this.logRepository.save(create);
  }

  async debug({ action, description, user, tags }: ILog): Promise<any> {
    const create = this.logRepository.create({
      level: EnumLoggerLevel.Debug,
      user: user,
      action,
      description,
      tags,
    });
    return this.logRepository.save(create);
  }

  async warning({ action, description, user, tags }: ILog): Promise<any> {
    const create = this.logRepository.create({
      level: EnumLoggerLevel.Warn,
      user: user,
      action,
      description,
      tags,
    });
    return this.logRepository.save(create);
  }

  async fatal({ action, description, user, tags }: ILog): Promise<any> {
    const create = this.logRepository.create({
      level: EnumLoggerLevel.Fatal,
      user: user,
      action,
      description,
      tags,
    });
    return this.logRepository.save(create);
  }
}
