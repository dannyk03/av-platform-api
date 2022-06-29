import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

export abstract class BaseEntity<T> {
  constructor(props: Partial<T>) {
    Object.assign(this, props);
  }

  @Index()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    update: false,
  })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
