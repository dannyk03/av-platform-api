import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { VendorLogo } from './vendor-logo.entity';
import { Product } from '@/catalog/product/entity';
import { BaseEntity } from '@/database/entity';

import { slugify } from '@/utils/helper';

@Entity()
export class Vendor extends BaseEntity<Vendor> {
  @Index()
  @Column({
    length: 30,
    unique: true,
  })
  name!: string;

  @Index()
  @Column({
    unique: true,
    length: 30,
  })
  slug!: string;

  @Index()
  @Column({
    length: 200,
    nullable: true,
  })
  description?: string;

  @Column({
    default: true,
  })
  isActive!: boolean;

  @OneToMany(() => Product, (product) => product.vendor, { cascade: true })
  products: Product[];

  @OneToOne(() => VendorLogo, (logo) => logo.vendor, {
    cascade: true,
    nullable: true,
  })
  logo?: VendorLogo;

  @BeforeInsert()
  beforeInsert() {
    this.slug = slugify(this.name);
  }
}
