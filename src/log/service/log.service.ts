import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';

import { Request } from 'express';
import { EntityManager, Repository } from 'typeorm';

import { Log } from '../entity';

import { ILogData, ILogRaw } from '../types';
import { IRequestApp } from '@/utils/request/types';
import { Optional } from 'utility-types';

import { EnumLogLevel } from '../constants';
import { ConnectionNames } from '@/database/constants';
import { EnumRequestMethod } from '@/utils/request/constants';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(Log, ConnectionNames.Default)
    private readonly logRepository: Repository<Log>,
    @Inject(REQUEST)
    private readonly request: Request & IRequestApp,
  ) {}

  async info({
    transactionalEntityManager,
    action,
    description,
    tags,
    data,
  }: ILogData & { transactionalEntityManager?: EntityManager }): Promise<Log> {
    return this.raw({
      transactionalEntityManager,
      level: EnumLogLevel.Info,
      action,
      description,
      tags,
      data,
    });
  }

  async debug({
    transactionalEntityManager,
    action,
    description,
    tags,
    data,
  }: ILogData & { transactionalEntityManager?: EntityManager }): Promise<Log> {
    return this.raw({
      transactionalEntityManager,
      level: EnumLogLevel.Debug,
      action,
      description,
      tags,
      data,
    });
  }

  async warn({
    transactionalEntityManager,
    action,
    description,
    tags,
    data,
  }: ILogData & { transactionalEntityManager?: EntityManager }): Promise<Log> {
    return this.raw({
      transactionalEntityManager,
      level: EnumLogLevel.Warn,
      action,
      description,
      tags,
      data,
    });
  }

  async error({
    transactionalEntityManager,
    action,
    description,
    tags,
    data,
  }: ILogData & { transactionalEntityManager?: EntityManager }): Promise<Log> {
    return this.raw({
      transactionalEntityManager,
      level: EnumLogLevel.Error,
      action,
      description,
      tags,
      data,
    });
  }

  async fatal({
    transactionalEntityManager,
    action,
    description,
    tags,
    data,
  }: ILogData & { transactionalEntityManager?: EntityManager }): Promise<Log> {
    return this.raw({
      transactionalEntityManager,
      level: EnumLogLevel.Fatal,
      action,
      description,
      tags,
      data,
    });
  }

  async raw({
    transactionalEntityManager,
    user = this.request.__user,
    role = this.request.__user?.role,
    path = this.request.path,
    method = this.request.method as EnumRequestMethod,
    params = this.request.params,
    body = this.request.body,
    correlationId = this.request.correlationId,
    userAgent = this.request.userAgent,
    version = this.request.version,
    repoVersion = this.request.repoVersion,
    exec = `${this.request.__class}::${this.request.__function}`,
    action,
    description,
    statusCode,
    tags,
    data,
    level,
  }: Optional<
    ILogRaw,
    | 'user'
    | 'role'
    | 'path'
    | 'method'
    | 'params'
    | 'body'
    | 'correlationId'
    | 'userAgent'
    | 'version'
    | 'repoVersion'
    | 'exec'
  > & {
    transactionalEntityManager?: EntityManager;
  }): Promise<Log> {
    const create = this.logRepository.create({
      user,
      role,
      path,
      method,
      params,
      body,
      correlationId,
      userAgent,
      version,
      repoVersion,
      action,
      description,
      statusCode,
      exec,
      tags,
      data,
      level,
    });

    return transactionalEntityManager
      ? transactionalEntityManager.save(create)
      : this.logRepository.save(create);
  }
}
