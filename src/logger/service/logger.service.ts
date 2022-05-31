import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { DatabaseEntity } from '@/database';
import { ILogger } from '../logger.interface';
import { LoggerLevel } from '../logger.constant';
import { LoggerDocument, LoggerEntity } from '../schema/logger.schema';

@Injectable()
export class LoggerService {
    constructor(
        @DatabaseEntity(LoggerEntity.name)
        private readonly loggerModel: Model<LoggerDocument>,
    ) {}

    async info({
        action,
        description,
        apiKey,
        user,
        tags,
    }: ILogger): Promise<LoggerDocument> {
        const create = new this.loggerModel({
            level: LoggerLevel.Info,
            user: new Types.ObjectId(user),
            apiKey: new Types.ObjectId(apiKey),
            anonymous: user ? false : true,
            action,
            description,
            tags,
        });
        return create.save();
    }

    async debug({
        action,
        description,
        apiKey,
        user,
        tags,
    }: ILogger): Promise<LoggerDocument> {
        const create = new this.loggerModel({
            level: LoggerLevel.Debug,
            user: new Types.ObjectId(user),
            apiKey: new Types.ObjectId(apiKey),
            anonymous: user ? false : true,
            action,
            description,
            tags,
        });
        return create.save();
    }

    async warning({
        action,
        description,
        apiKey,
        user,
        tags,
    }: ILogger): Promise<LoggerDocument> {
        const create = new this.loggerModel({
            level: LoggerLevel.Warn,
            user: new Types.ObjectId(user),
            apiKey: new Types.ObjectId(apiKey),
            anonymous: user ? false : true,
            action,
            description,
            tags,
        });
        return create.save();
    }

    async fatal({
        action,
        description,
        apiKey,
        user,
        tags,
    }: ILogger): Promise<LoggerDocument> {
        const create = new this.loggerModel({
            level: LoggerLevel.Fatal,
            user: new Types.ObjectId(user),
            apiKey: new Types.ObjectId(apiKey),
            anonymous: user ? false : true,
            action,
            description,
            tags,
        });
        return create.save();
    }
}
