import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
// Entities
import { BaseEntity } from '@/database/entity';

import { DisplayLanguage } from '@/language/display-language/entity';
import { ProductImage } from '@/catalog/product-image/entity';
import { Product } from '@/catalog/product/entity';

//

@Entity()
export class ProductDisplayOption extends BaseEntity<ProductDisplayOption> {
  @Column({
    length: 50,
  })
  name!: string;

  @Column({
    nullable: true,
    length: 200,
  })
  description?: string;

  @Column({
    type: 'varchar',
    length: 20,
    array: true,
    default: [],
  })
  keywords!: string[];

  @ManyToOne(() => Product, (product) => product.displayOptions)
  product: Product;

  @ManyToOne(() => DisplayLanguage)
  @JoinColumn()
  language!: DisplayLanguage;

  @OneToMany(() => ProductImage, (image) => image.productDisplayOptions, {
    cascade: true,
  })
  images: ProductImage[];
}
