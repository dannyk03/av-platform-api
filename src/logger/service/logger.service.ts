import { Injectable } from '@nestjs/common';
import { ILogger } from '../logger.interface';
import { ENUM_LOGGER_LEVEL } from '../logger.constant';
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
    //   level: ENUM_LOGGER_LEVEL.INFO,
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
    //   level: ENUM_LOGGER_LEVEL.DEBUG,
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
    //   level: ENUM_LOGGER_LEVEL.WARM,
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
    //   level: ENUM_LOGGER_LEVEL.FATAL,
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
