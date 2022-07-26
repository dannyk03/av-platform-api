import { Column, Entity, ManyToOne } from 'typeorm';
// Entities
import { BaseEntity } from '$/database/entity';
import { User } from '$/user/entity';
//

@Entity()
export class GiftRecipient extends BaseEntity<GiftRecipient> {
  @ManyToOne(() => User)
  user?: User;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  additionalData?: object;
}
