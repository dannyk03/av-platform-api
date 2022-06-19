import { AcpPolicyLoginSerialization } from '@acp/policy';
import { AcpPolicy } from '@acp/policy/entity/acp-policy.entity';
import { Exclude, plainToInstance, Transform } from 'class-transformer';

export class AcpRoleLoginSerialization {
  readonly id: string;

  @Transform(({ value }) => plainToInstance(AcpPolicyLoginSerialization, value))
  readonly policy: AcpPolicy;

  readonly isActive: boolean;

  @Exclude()
  readonly createdAt: Date;

  @Exclude()
  readonly updatedAt: Date;

  @Exclude()
  readonly deletedAt: Date;
}
