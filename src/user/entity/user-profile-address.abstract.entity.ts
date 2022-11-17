import { Column } from 'typeorm';

import { BaseEntity } from '@/database/entity';

export abstract class Address extends BaseEntity<Address> {
  @Column({
    length: 100,
    nullable: true,
  })
  addressLine1?: string;

  @Column({
    length: 100,
    nullable: true,
  })
  addressLine2?: string;

  @Column({
    length: 50,
    nullable: true,
  })
  city?: string;

  @Column({
    length: 50,
    nullable: true,
  })
  state?: string;

  @Column({
    length: 30,
    nullable: true,
  })
  zipCode?: string;

  @Column({
    length: 50,
    nullable: true,
  })
  country?: string;
}
