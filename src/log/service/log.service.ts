import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EntityManager, Repository } from 'typeorm';

import { Log } from '../entity';

import { ILog } from '../log.interface';

import { ConnectionNames } from '@/database';

import { EnumLogLevel } from '../log.constant';

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
}
