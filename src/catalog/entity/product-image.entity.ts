import { Entity, Column, ManyToMany } from 'typeorm';
// Entities
import { BaseEntity } from '@/database/entity';
import { ProductDisplayOption } from '@/catalog/entity';
//

@Entity()
export class ProductImage extends BaseEntity<ProductImage> {
  @Column({
    unique: true,
    length: 30,
  })
  name!: string;

  @Column({
    unique: true,
    length: 50,
  })
  url!: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  properties?: object;

  @ManyToMany(() => ProductDisplayOption)
  productDisplayOptions!: ProductDisplayOption[];
}
