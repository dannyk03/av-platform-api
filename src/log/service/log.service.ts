import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Log } from '../entity';

import { ConnectionNames } from '@/database';

import { EnumLogLevel } from '../log.constant';
import { ILog } from '../log.interface';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(Log, ConnectionNames.Default)
    private readonly logRepository: Repository<Log>,
  ) {}

  async info({
    action,
    description,
    user,
    method,
    correlationId,
    role,
    params,
    bodies,
    statusCode,
    tags,
    userAgent,
    originalUrl,
    transactionalEntityManager,
  }: ILog): Promise<Log> {
    const create = this.logRepository.create({
      level: EnumLogLevel.Info,
      user: user,
      anonymous: Boolean(user),
      method,
      correlationId,
      role: role,
      params,
      bodies,
      statusCode,
      tags,
      action,
      description,
      userAgent,
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
    method,
    correlationId,
    role,
    params,
    bodies,
    statusCode,
    tags,
    userAgent,
    originalUrl,
    transactionalEntityManager,
  }: ILog): Promise<Log> {
    const create = this.logRepository.create({
      level: EnumLogLevel.Debug,
      user: user,
      anonymous: Boolean(user),
      method,
      correlationId,
      role: role,
      params,
      bodies,
      statusCode,
      tags,
      action,
      description,
      userAgent,
      originalUrl,
    });

    return transactionalEntityManager
      ? transactionalEntityManager.save(create)
      : this.logRepository.save(create);
  }

  async warn({
    action,
    description,
    user,
    method,
    correlationId,
    role,
    params,
    bodies,
    statusCode,
    tags,
    userAgent,
    originalUrl,
    transactionalEntityManager,
  }: ILog): Promise<Log> {
    const create = this.logRepository.create({
      level: EnumLogLevel.Warn,
      user: user,
      anonymous: Boolean(user),
      method,
      correlationId,
      role: role,
      params,
      bodies,
      statusCode,
      tags,
      action,
      description,
      userAgent,
      originalUrl,
    });

    return transactionalEntityManager
      ? transactionalEntityManager.save(create)
      : this.logRepository.save(create);
  }

  async fatal({
    action,
    description,
    user,
    method,
    correlationId,
    role,
    params,
    bodies,
    statusCode,
    tags,
    userAgent,
    originalUrl,
    transactionalEntityManager,
  }: ILog): Promise<Log> {
    const create = this.logRepository.create({
      level: EnumLogLevel.Fatal,
      user: user,
      anonymous: Boolean(user),
      method,
      correlationId,
      role: role,
      params,
      bodies,
      statusCode,
      tags,
      action,
      description,
      userAgent,
      originalUrl,
    });

    return transactionalEntityManager
      ? transactionalEntityManager.save(create)
      : this.logRepository.save(create);
  }
}
