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
    update: false,
  })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
