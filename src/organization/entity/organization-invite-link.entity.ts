import { Entity, Column, Index, ManyToOne } from 'typeorm';
// Entities
import { BaseEntity } from '@/database/entity';
import { Organization } from '@/organization/entity';
import { AclRole } from '@acl/role/entity';
//

@Entity()
export class OrganizationInviteLink extends BaseEntity<OrganizationInviteLink> {
  @Index()
  @Column({
    unique: true,
    length: 50,
  })
  email!: string;

  @Index()
  @Column({
    unique: true,
    length: 32,
  })
  code!: string;

  @Column({ nullable: true })
  usedAt?: Date;

  @Column({ nullable: true })
  expiresAt?: Date;

  @ManyToOne(() => AclRole, (role) => role.invites)
  role!: AclRole;

  @ManyToOne(() => Organization, (organization) => organization.invites)
  organization!: Organization;
}
