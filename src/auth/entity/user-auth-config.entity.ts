import { Entity, Column } from 'typeorm';
// Entities
import { BaseEntity } from '@/database/entity';
//

@Entity()
export class UserAuthConfig extends BaseEntity<UserAuthConfig> {
  @Column({
    length: 100,
  })
  password!: string;

  @Column({
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
