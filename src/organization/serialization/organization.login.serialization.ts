import { Exclude } from 'class-transformer';

export class OrganizationLoginSerialization {
  readonly isActive: boolean;
  readonly name: boolean;

  @Exclude()
  readonly id: string;

  @Exclude()
  readonly slug: string;

  @Exclude()
  readonly createdAt: Date;

  @Exclude()
  readonly updatedAt: Date;

  @Exclude()
  readonly deletedAt: Date;
}
