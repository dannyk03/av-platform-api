import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AuthApiEntity } from '@/auth/schema/auth.api.schema';
import { LoggerAction, LoggerLevel } from '../logger.constant';

@Schema({ timestamps: true, versionKey: false })
export class LoggerEntity {
    @Prop({
        required: true,
        enum: LoggerLevel,
    })
    level: string;

    @Prop({
        required: true,
        enum: LoggerAction,
    })
    action: string;

    @Prop({
        required: false,
    })
    user?: Types.ObjectId;

    @Prop({
        required: true,
        ref: AuthApiEntity.name,
    })
    apiKey: Types.ObjectId;

    @Prop({
        required: true,
        default: true,
    })
    anonymous: boolean;

    @Prop({
        required: true,
        trim: true,
        lowercase: true,
    })
    description: string;

    @Prop({
        required: false,
    })
    tags?: string[];
}

export const LoggerDatabaseName = 'loggers';
export const LoggerSchema = SchemaFactory.createForClass(LoggerEntity);

export type LoggerDocument = LoggerEntity & Document;
