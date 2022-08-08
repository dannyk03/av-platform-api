import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { GiftIntent } from './gift-intent.entity';
import { Gift } from './gift.entity';
import { BaseEntity } from '@/database/entity';

@Entity()
export class GiftOrder extends BaseEntity<GiftOrder> {}
