import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserEntity } from '@/user';
import { slugPlugin } from '@/database';

@Schema({ timestamps: true, versionKey: false })
export class OrganizationEntity {
    @Prop({
        required: true,
        unique: true,
        trim: true,
    })
    name: string;

    @Prop({
        required: true,
        index: true,
        unique: true,
        lowercase: true,
        trim: true,
    })
    slug: string;

    @Prop({
        required: true,
        default: true,
    })
    isActive: boolean;

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: UserEntity.name,
    })
    owner: Types.ObjectId;
}

export const OrganizationsCollectionName = 'organizations';
export const OrganizationSchema =
    SchemaFactory.createForClass(OrganizationEntity);

export type OrganizationDocument = OrganizationEntity & Document;

// Plugins
OrganizationSchema.plugin(slugPlugin('name'));

// Hooks
// OrganizationSchema.pre<OrganizationDocument>('validate', function (next) {
//     // this.slug = slugify(this.name, )
//     next();
// });
