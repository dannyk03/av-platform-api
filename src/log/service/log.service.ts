import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EntityManager, Repository } from 'typeorm';

import { Log } from '../entity';

import { ILog, ILogRaw } from '../types/log.interface';

import { EnumLogLevel } from '../constants';
import { ConnectionNames } from '@/database/constants';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(Log, ConnectionNames.Default)
    private readonly logRepository: Repository<Log>,
  ) {}

  async info({
    transactionalEntityManager,
    ...logData
  }: ILog & { transactionalEntityManager?: EntityManager }): Promise<Log> {
    const create = this.logRepository.create({
      level: EnumLogLevel.Info,
      ...logData,
    });
    return transactionalEntityManager
      ? transactionalEntityManager.save(create)
      : this.logRepository.save(create);
  }

  async debug({
    transactionalEntityManager,
    ...logData
  }: ILog & { transactionalEntityManager?: EntityManager }): Promise<Log> {
    const create = this.logRepository.create({
      level: EnumLogLevel.Debug,
      ...logData,
    });

    return transactionalEntityManager
      ? transactionalEntityManager.save(create)
      : this.logRepository.save(create);
  }

  async warn({
    transactionalEntityManager,
    ...logData
  }: ILog & { transactionalEntityManager?: EntityManager }): Promise<Log> {
    const create = this.logRepository.create({
      level: EnumLogLevel.Warn,
      ...logData,
    });

    return transactionalEntityManager
      ? transactionalEntityManager.save(create)
      : this.logRepository.save(create);
  }
  async error({
    transactionalEntityManager,
    ...logData
  }: ILog & { transactionalEntityManager?: EntityManager }): Promise<Log> {
    const create = this.logRepository.create({
      level: EnumLogLevel.Error,
      ...logData,
    });

    return transactionalEntityManager
      ? transactionalEntityManager.save(create)
      : this.logRepository.save(create);
  }

  async fatal({
    transactionalEntityManager,
    ...logData
  }: ILog & { transactionalEntityManager?: EntityManager }): Promise<Log> {
    const create = this.logRepository.create({
      level: EnumLogLevel.Fatal,
      ...logData,
    });

    return transactionalEntityManager
      ? transactionalEntityManager.save(create)
      : this.logRepository.save(create);
  }

  async raw({
    transactionalEntityManager,
    ...logData
  }: ILogRaw & {
    transactionalEntityManager?: EntityManager;
  }): Promise<Log> {
    const create = this.logRepository.create({
      ...logData,
    });

    return transactionalEntityManager
      ? transactionalEntityManager.save(create)
      : this.logRepository.save(create);
  }
}
