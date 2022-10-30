import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { ProductDisplayOption } from '@/catalog/product-display-option/entity';
import { Vendor } from '@/catalog/vendor/entity';
import { Currency } from '@/currency/entity';
import { BaseEntity } from '@/database/entity';
import { Gift } from '@/gifting/entity';

@Entity()
export class Product extends BaseEntity<Product> {
  @Index()
  @Column({
    length: 30,
    unique: true,
  })
  sku!: string;

  @Index()
  @Column({
    nullable: true,
    length: 30,
  })
  brand?: string;

  @Column({
    default: true,
  })
  isActive!: boolean;

  @OneToMany(
    () => ProductDisplayOption,
    (productDisplayOption) => productDisplayOption.product,
    {
      cascade: true,
    },
  )
  displayOptions!: ProductDisplayOption[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  shippingCost!: number;

  @ManyToOne(() => Vendor, (vendor) => vendor.products, {
    nullable: true,
  })
  @JoinColumn()
  vendor?: Vendor;

  @Column({
    length: 30,
    nullable: true,
  })
  vendorName?: string;

  @ManyToOne(() => Currency)
  @JoinColumn()
  currency: Currency;

  @Column({
    length: 30,
  })
  taxCode!: string;

  @ManyToMany(() => Gift, (giftOption) => giftOption.products)
  giftOptions: Gift[];

  @BeforeInsert()
  beforeInsert() {
    this.sku = this.sku.toUpperCase();
  }
}
