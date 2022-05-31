import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
}

export const OrganizationsCollectionName = 'organizations';
export const OrganizationSchema =
    SchemaFactory.createForClass(OrganizationEntity);

export type OrganizationDocument = OrganizationEntity & Document;

// Hooks
OrganizationSchema.pre<OrganizationDocument>('save', function (next) {
    this.name = this.name.toLowerCase();
    next();
});
