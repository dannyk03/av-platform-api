import { Entity, PrimaryColumn } from 'typeorm';

import { BaseEntity } from '@/database/entity';

@Entity()
export class StripeWebhookEvent extends BaseEntity<StripeWebhookEvent> {
  @PrimaryColumn()
  public id: string;
}

export default StripeWebhookEvent;
