import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';

import { Vendor } from './vendor.entity';
import { BaseEntity } from '@/database/entity';

@Entity()
export class VendorLogo extends BaseEntity<VendorLogo> {
  @Index()
  @Column({
    length: 30,
  })
  fileName!: string;

  @Column({
    unique: true,
    length: 32,
    update: false,
  })
  assetId!: string;

  @Column({
    unique: true,
    length: 100,
  })
  publicId!: string;

  @Column({
    unique: true,
    length: 200,
  })
  secureUrl!: string;

  @OneToOne(() => Vendor, (vendor) => vendor.logo, { onDelete: 'CASCADE' })
  @JoinColumn()
  vendor: Vendor;
}
