import { Injectable } from '@nestjs/common';
import { ILogger } from '../logger.interface';
import { EnumLoggerLevel } from '../logger.constant';
import { LoggerEntity } from '../entity/logger.entity';
import { ConnectionNames } from '@/database';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LoggerService {
  constructor(
    @InjectRepository(LoggerEntity, ConnectionNames.Default)
    private loggerRepository: Repository<LoggerEntity>,
  ) {}

  async info({
    action,
    description,
    apiKey,
    user,
    tags,
  }: ILogger): Promise<any> {
    // const create = new this.loggerRepository({
    //   level: EnumLoggerLevel.Info,
    //   user: new Types.ObjectId(user),
    //   apiKey: new Types.ObjectId(apiKey),
    //   anonymous: user ? false : true,
    //   action,
    //   description,
    //   tags,
    // });
    // return create.save();
  }

  async debug({
    action,
    description,
    apiKey,
    user,
    tags,
  }: ILogger): Promise<any> {
    // const create = new this.loggerRepository({
    //   level: EnumLoggerLevel.Debug,
    //   user: new Types.ObjectId(user),
    //   apiKey: new Types.ObjectId(apiKey),
    //   anonymous: user ? false : true,
    //   action,
    //   description,
    //   tags,
    // });
    // return create.save();
  }

  async warning({
    action,
    description,
    apiKey,
    user,
    tags,
  }: ILogger): Promise<any> {
    // const create = new this.loggerRepository({
    //   level: EnumLoggerLevel.Warn,
    //   user: new Types.ObjectId(user),
    //   apiKey: new Types.ObjectId(apiKey),
    //   anonymous: user ? false : true,
    //   action,
    //   description,
    //   tags,
    // });
    // return create.save();
  }

  async fatal({
    action,
    description,
    apiKey,
    user,
    tags,
  }: ILogger): Promise<any> {
    // const create = new this.loggerRepository({
    //   level: EnumLoggerLevel.Fatal,
    //   user: new Types.ObjectId(user),
    //   apiKey: new Types.ObjectId(apiKey),
    //   anonymous: user ? false : true,
    //   action,
    //   description,
    //   tags,
    // });
    // return create.save();
  }
}
