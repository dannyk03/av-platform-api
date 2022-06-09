import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  //   BaseEntity
} from 'typeorm';

export abstract class BaseEntity<T> {
  constructor(props: Partial<T>) {
    Object.assign(this, props);
  }
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    update: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  updatedAt: Date;
}
