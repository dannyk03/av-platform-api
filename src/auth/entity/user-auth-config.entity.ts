import {
  Entity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
// Entities
import { BaseEntity } from '@/database/entities/base.entity';
import { User } from '@/user/entity/user.entity';
//

@Entity()
export class UserAuthConfig extends BaseEntity<UserAuthConfig> {
  @Column({
    type: 'varchar',
    length: 100,
  })
  password!: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  salt!: string;

  @Column()
  passwordExpiredAt!: Date;

  @Column({
    nullable: true,
  })
  emailVerifiedAt?: Date;
}
