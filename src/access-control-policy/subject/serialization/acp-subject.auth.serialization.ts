import { AcpAbilityAuthSerialization } from '@acp/ability';
import { AcpAbility } from '@acp/ability/entity/acp-ability.entity';
import { Exclude, plainToInstance, Transform } from 'class-transformer';

export class AcpSubjectAuthSerialization {
  @Transform(({ value: abilities }) =>
    abilities.map((ability: AcpAbility) =>
      plainToInstance(AcpAbilityAuthSerialization, ability),
    ),
  )
  readonly abilities: AcpAbility[];

  @Exclude()
  readonly id: string;

  @Exclude()
  readonly createdAt: Date;

  @Exclude()
  readonly updatedAt: Date;

  @Exclude()
  readonly deletedAt: Date;
}
