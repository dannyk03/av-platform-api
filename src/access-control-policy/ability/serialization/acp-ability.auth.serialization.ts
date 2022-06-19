import { Exclude } from 'class-transformer';

export class AcpAbilityAuthSerialization {
  @Exclude()
  readonly id: string;

  @Exclude()
  readonly createdAt: Date;

  @Exclude()
  readonly updatedAt: Date;

  @Exclude()
  readonly deletedAt: Date;
}
