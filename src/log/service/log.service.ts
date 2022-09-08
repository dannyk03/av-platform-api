import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';

import { Request } from 'express';
import { EntityManager, Repository } from 'typeorm';

import { Log } from '../entity';

import { HelperMaskService } from '@/utils/helper/service';

import { ILogData, ILogMask, ILogRaw } from '../type';
import { IRequestApp } from '@/utils/request/type';
import { Optional } from 'utility-types';

import { EnumLogLevel } from '../constant';
import { ConnectionNames } from '@/database/constant';
import { EnumRequestMethod } from '@/utils/request/constant';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(Log, ConnectionNames.Default)
    private readonly logRepository: Repository<Log>,
    @Inject(REQUEST)
    private readonly request: Request & IRequestApp,
    private readonly helperMaskService: HelperMaskService,
  ) {}

  async info({
    transactionalEntityManager,
    mask,
    action,
    description,
    tags,
    data,
  }: ILogData & {
    transactionalEntityManager?: EntityManager;
    mask?: ILogMask;
  }): Promise<Log> {
    return this.raw({
      transactionalEntityManager,
      mask,
      level: EnumLogLevel.Info,
      action,
      description,
      tags,
      data,
    });
  }

  async debug({
    transactionalEntityManager,
    mask,
    action,
    description,
    tags,
    data,
  }: ILogData & {
    transactionalEntityManager?: EntityManager;
    mask?: ILogMask;
  }): Promise<Log> {
    return this.raw({
      transactionalEntityManager,
      mask,
      level: EnumLogLevel.Debug,
      action,
      description,
      tags,
      data,
    });
  }

  async warn({
    transactionalEntityManager,
    mask,
    action,
    description,
    tags,
    data,
  }: ILogData & {
    transactionalEntityManager?: EntityManager;
    mask?: ILogMask;
  }): Promise<Log> {
    return this.raw({
      transactionalEntityManager,
      mask,
      level: EnumLogLevel.Warn,
      action,
      description,
      tags,
      data,
    });
  }

  async error({
    transactionalEntityManager,
    mask,
    action,
    description,
    tags,
    data,
  }: ILogData & {
    transactionalEntityManager?: EntityManager;
    mask?: ILogMask;
  }): Promise<Log> {
    return this.raw({
      transactionalEntityManager,
      mask,
      level: EnumLogLevel.Error,
      action,
      description,
      tags,
      data,
    });
  }

  async fatal({
    transactionalEntityManager,
    mask,
    action,
    description,
    tags,
    data,
  }: ILogData & {
    transactionalEntityManager?: EntityManager;
    mask?: ILogMask;
  }): Promise<Log> {
    return this.raw({
      transactionalEntityManager,
      mask,
      level: EnumLogLevel.Fatal,
      action,
      description,
      tags,
      data,
    });
  }

  async raw({
    transactionalEntityManager,
    mask,
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
    mask?: ILogMask;
  }): Promise<Log> {
    const create = this.logRepository.create({
      user,
      role,
      path,
      method,
      params,
      body: await this.helperMaskService.maskBody({
        body,
        options: mask,
      }),
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
