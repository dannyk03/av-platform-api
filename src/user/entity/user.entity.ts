import { Column, Entity, Index, ManyToOne, OneToMany, OneToOne } from 'typeorm';

import { UserProfile } from './user-profile.entity';
import { UserAuthConfig } from '@/auth/entity';
import { BaseEntity } from '@/database/entity';
import { InvitationLink } from '@/networking/entity';
import { GiftOrder } from '@/order/entity';
import { Organization } from '@/organization/entity';
import { StripePayment } from '@/payment/stripe/entity';
import { AclRole } from '@acl/role/entity';

@Entity()
export class User extends BaseEntity<User> {
  @Index()
  @Column({
    unique: true,
    length: 50,
  })
  email!: string;

  @Index()
  @Column({
    length: 30,
    unique: true,
    nullable: true,
  })
  phoneNumber?: string;

  @Column({
    default: true,
  })
  isActive!: boolean;

  @ManyToOne(() => AclRole, (role) => role.users, { nullable: true })
  role?: AclRole;

  @ManyToOne(() => Organization, (organization) => organization.users, {
    nullable: true,
  })
  organization?: Organization;

  @OneToOne(() => UserAuthConfig, (authConfig) => authConfig.user, {
    cascade: true,
    nullable: true,
  })
  authConfig?: UserAuthConfig;

  @OneToOne(() => UserProfile, (profile) => profile.user, {
    cascade: true,
  })
  profile: UserProfile;

  @OneToOne(() => InvitationLink, (invitationLink) => invitationLink.user, {
    cascade: true,
  })
  invitationLink: InvitationLink;

  @OneToMany(() => GiftOrder, (order) => order.user)
  giftOrders: GiftOrder;

  @OneToOne(() => StripePayment, (stripe) => stripe.user, {
    cascade: true,
  })
  stripe: StripePayment;
}
