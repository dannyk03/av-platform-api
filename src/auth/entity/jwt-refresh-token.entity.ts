import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class JwtRefreshToken {
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
