import { Exclude, Transform, plainToInstance } from 'class-transformer';

import { AclAbility } from '@acl/ability/entity';

import { AclAbilitySerialization } from '@acl/ability/serialization';

export class AclSubjectSerialization {
  @Transform(({ value: abilities }) =>
    abilities.map((ability: AclAbility) =>
      plainToInstance(AclAbilitySerialization, ability),
    ),
  )
  readonly abilities: AclAbilitySerialization[];

  @Exclude()
  readonly id: string;

  @Exclude()
  readonly createdAt: Date;

  @Exclude()
  readonly updatedAt: Date;

  @Exclude()
  readonly deletedAt: Date;
}
