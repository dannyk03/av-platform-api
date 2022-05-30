import { Exclude, Type } from 'class-transformer';

export class TenantGetSerialization {
  @Type(() => String)
  readonly slug: string;

  readonly isActive: boolean;
  readonly name: string;

  readonly createdAt: Date;

  @Exclude()
  readonly updatedAt: Date;
}
