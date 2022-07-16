import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Entities
import { Log } from '../entity';
//
import { ILog } from '../log.interface';
import { EnumLoggerLevel } from '../log.constant';
import { ConnectionNames } from '@/database';

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
    transactionalEntityManager,
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
    return transactionalEntityManager
      ? transactionalEntityManager.save(create)
      : this.logRepository.save(create);
  }

  async debug({
    action,
    description,
    user,
    tags,
    transactionalEntityManager,
  }: ILog): Promise<any> {
    const create = this.logRepository.create({
      level: EnumLoggerLevel.Debug,
      user: user,
      action,
      description,
      tags,
    });

    return transactionalEntityManager
      ? transactionalEntityManager.save(create)
      : this.logRepository.save(create);
  }

  async warning({
    action,
    description,
    user,
    tags,
    transactionalEntityManager,
  }: ILog): Promise<any> {
    const create = this.logRepository.create({
      level: EnumLoggerLevel.Warn,
      user: user,
      action,
      description,
      tags,
    });

    return transactionalEntityManager
      ? transactionalEntityManager.save(create)
      : this.logRepository.save(create);
  }

  async fatal({
    action,
    description,
    user,
    tags,
    transactionalEntityManager,
  }: ILog): Promise<any> {
    const create = this.logRepository.create({
      level: EnumLoggerLevel.Fatal,
      user: user,
      action,
      description,
      tags,
    });

    return transactionalEntityManager
      ? transactionalEntityManager.save(create)
      : this.logRepository.save(create);
  }
}
