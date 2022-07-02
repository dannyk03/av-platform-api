import { Entity, Column, Index, ManyToOne } from 'typeorm';
// Entities
import { BaseEntity } from '@/database/entities/base.entity';
import { Organization } from '@/organization/entity/organization.entity';
import { AclRole } from '@acl/role/entity/acl-role.entity';
//

@Entity()
export class OrganizationInvite extends BaseEntity<OrganizationInvite> {
  @Index()
  @Column({
    type: 'varchar',
    unique: true,
    length: 50,
  })
  email!: string;

  @Index()
  @Column({
    type: 'varchar',
    unique: true,
    length: 32,
  })
  inviteCode!: string;

  @Column({ nullable: true })
  usedAt?: Date;

  @Column({ nullable: true })
  expiresAt?: Date;

  @ManyToOne(() => AclRole, (role) => role.invites)
  role!: AclRole;

  @ManyToOne(() => Organization, (organization) => organization.invites)
  organization!: Organization;
}
