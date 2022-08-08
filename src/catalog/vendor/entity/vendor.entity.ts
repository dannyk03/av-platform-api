import { BeforeInsert, Column, Entity, Index, OneToMany } from 'typeorm';

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

  @OneToMany(() => Product, (product) => product.vendor)
  products: Product[];

  @BeforeInsert()
  beforeInsert() {
    this.slug = slugify(this.name);
  }
}
