import { Column, Entity, ManyToOne } from 'typeorm';
// Entities
import { BaseEntity } from '$/database/entity';
import { User } from '$/user/entity';
//

@Entity()
export class GiftSender extends BaseEntity<GiftSender> {
  @ManyToOne(() => User)
  user?: User;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  additionalData?: object;
}
