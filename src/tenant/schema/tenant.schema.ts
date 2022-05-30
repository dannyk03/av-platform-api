import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class TenantEntity {
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

export const TenantsCollectionName = 'tenants';
export const TenantSchema = SchemaFactory.createForClass(TenantEntity);

export type TenantDocument = TenantEntity & Document;

// Hooks
TenantSchema.pre<TenantDocument>('save', function (next) {
  this.name = this.name.toLowerCase();
  next();
});
