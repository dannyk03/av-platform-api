import { Column, Entity } from 'typeorm';
// Entities
import { BaseEntity } from '$/database/entity';
//

@Entity()
export class UserProfile extends BaseEntity<UserProfile> {
  @Column({
    length: 30,
    nullable: true,
  })
  firstName?: string;

  @Column({
    length: 30,
    nullable: true,
  })
  lastName?: string;

  @Column({
    length: 100,
    nullable: true,
  })
  title?: string;
}
