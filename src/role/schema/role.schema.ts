import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { PermissionEntity } from '@/permission/schema/permission.schema';
import { Roles } from '../role.constant';

@Schema({ timestamps: true, versionKey: false })
export class RoleEntity {
    @Prop({
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    })
    name: string;

    @Prop({
        required: true,
        index: true,
        unique: true,
        uppercase: true,
        trim: true,
        enum: Roles,
    })
    code: string;

    @Prop({
        required: true,
        type: Array,
        default: [],
        ref: PermissionEntity.name,
    })
    permissions: Types.ObjectId[];

    @Prop({
        required: true,
        default: true,
    })
    isActive: boolean;
}

export const RoleDatabaseName = 'roles';
export const RoleSchema = SchemaFactory.createForClass(RoleEntity);

export type RoleDocument = RoleEntity & Document;

// Hooks
RoleSchema.pre<RoleDocument>('save', function (next) {
    this.code = this.code.toUpperCase();
    this.name = this.code.toLowerCase().replace('_', ' ');
    next();
});
