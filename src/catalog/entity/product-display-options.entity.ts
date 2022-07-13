import {
  Entity,
  Column,
  ManyToOne,
  Unique,
  JoinColumn,
  OneToOne,
} from 'typeorm';
// Entities
import { BaseEntity } from '@/database/entity';
import { Product } from './product.entity';
import { DisplayLanguage } from '@/language/display-language/entity';
//

@Entity()
@Unique('uq_product_display_option_language', ['language', 'product'])
export class ProductDisplayOption extends BaseEntity<ProductDisplayOption> {
  @OneToOne(() => DisplayLanguage)
  @JoinColumn()
  language!: DisplayLanguage;

  @Column({
    type: 'varchar',
    length: 100,
  })
  imageUrl: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 200,
  })
  description: string;

  @ManyToOne(() => Product, (product) => product.displayOptions)
  product: Product;
}
