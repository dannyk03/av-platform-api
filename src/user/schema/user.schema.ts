import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { IAwsS3Response } from '@/aws/aws.interface';
import { RoleEntity } from '@/role/schema/role.schema';

@Schema({ timestamps: true, versionKey: false })
export class UserEntity {
    @Prop({
        required: true,
        lowercase: true,
        trim: true,
    })
    firstName: string;

    @Prop({
        required: false,
        lowercase: true,
        trim: true,
    })
    lastName?: string;

    @Prop({
        required: true,
        index: true,
        unique: true,
        lowercase: true,
        trim: true,
    })
    email: string;

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: RoleEntity.name,
    })
    role: Types.ObjectId;

    @Prop({
        required: true,
    })
    password: string;

    @Prop({
        required: true,
    })
    passwordExpired: Date;

    @Prop({
        required: true,
    })
    salt: string;

    @Prop({
        required: true,
        default: true,
    })
    isActive: boolean;

    @Prop({
        required: false,
        _id: false,
        type: {
            path: String,
            pathWithFilename: String,
            filename: String,
            completedUrl: String,
            baseUrl: String,
            mime: String,
        },
    })
    photo?: IAwsS3Response;
}

export const UserDatabaseName = 'users';
export const UserSchema = SchemaFactory.createForClass(UserEntity);

export type UserDocument = UserEntity & Document;

// Hooks
UserSchema.pre<UserDocument>('save', function (next) {
    this.email = this.email.toLowerCase();
    this.firstName = this.email.toLowerCase();

    if (this.lastName) {
        this.lastName = this.lastName.toLowerCase();
    }
    next();
});
