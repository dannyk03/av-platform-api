import { AclAbilitySerialization } from '@acl/ability';
import { AclAbility } from '@acl/ability/entity/acl-ability.entity';
import { Exclude, plainToInstance, Transform } from 'class-transformer';

export class AclSubjectSerialization {
  @Transform(({ value: abilities }) =>
    abilities.map((ability: AclAbility) =>
      plainToInstance(AclAbilitySerialization, ability),
    ),
  )
  readonly abilities: AclAbility[];

  @Exclude()
  readonly id: string;

  @Exclude()
  readonly createdAt: Date;

  @Exclude()
  readonly updatedAt: Date;

  @Exclude()
  readonly deletedAt: Date;
}
