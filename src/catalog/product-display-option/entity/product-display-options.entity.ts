import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { ProductImage } from '@/catalog/product-image/entity';
import { Product } from '@/catalog/product/entity';
import { BaseEntity } from '@/database/entity';
import { DisplayLanguage } from '@/language/display-language/entity';

@Entity()
export class ProductDisplayOption extends BaseEntity<ProductDisplayOption> {
  @Index()
  @Column({
    length: 75,
  })
  name!: string;

  @Index()
  @Column({
    nullable: true,
    length: 1500,
  })
  description?: string;

  @Index()
  @Column({
    type: 'varchar',
    length: 20,
    array: true,
    default: [],
  })
  keywords!: string[];

  @ManyToOne(() => Product, (product) => product.displayOptions, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @ManyToOne(() => DisplayLanguage)
  @JoinColumn()
  language!: DisplayLanguage;

  @OneToMany(() => ProductImage, (image) => image.productDisplayOption, {
    cascade: true,
    nullable: true,
  })
  images?: ProductImage[];
}
