import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
// Entities
import { BaseEntity } from '@/database/entity';
import { Product } from './product.entity';
import { DisplayLanguage } from '@/language/display-language/entity';
import { ProductImage } from './product-image.entity';
//

@Entity()
export class ProductDisplayOption extends BaseEntity<ProductDisplayOption> {
  @OneToOne(() => DisplayLanguage)
  @JoinColumn()
  language!: DisplayLanguage;

  @Column({
    length: 50,
  })
  name: string;

  @Column({
    nullable: true,
    length: 200,
  })
  description?: string;

  @ManyToOne(() => Product, (product) => product.displayOptions)
  product: Product;

  @ManyToMany(() => ProductImage, (image) => image.productDisplayOptions)
  @JoinTable({ name: 'product_display_options_product_images' })
  images: ProductImage[];
}
