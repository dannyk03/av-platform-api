import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
} from 'typeorm';

@Entity()
export class AuthApi {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  description?: string;

  @Column({
    unique: true,
  })
  key: string;

  @Column()
  hash: string;

  @Column()
  encryptionKey: string;

  @Column()
  passphrase: string;

  @Column()
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
