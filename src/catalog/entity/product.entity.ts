import { Entity, Column, Index, OneToMany } from 'typeorm';
// Entities
import { BaseEntity } from '@/database/entity';
import { ProductDisplayOption } from './product-display-options.entity';
//

@Entity()
export class Product extends BaseEntity<Product> {
  @Index()
  @Column({
    length: 30,
    unique: true,
  })
  sku!: string;

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
  displayOptions!: ProductDisplayOption;
}
