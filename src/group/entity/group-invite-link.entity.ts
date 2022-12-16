import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { Group } from './group.entity';
import { BaseEntity } from '@/database/entity';

@Entity()
export class GroupInviteLink extends BaseEntity<GroupInviteLink> {
  @ManyToOne(() => Group)
  @JoinColumn()
  group!: Group;

  @Index()
  @Column({
    unique: true,
    length: 21,
    update: false,
  })
  code!: string;
}
