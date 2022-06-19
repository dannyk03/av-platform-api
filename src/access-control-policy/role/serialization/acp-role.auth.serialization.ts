import { AcpPolicyAuthSerialization } from '@acp/policy';
import { AcpPolicy } from '@acp/policy/entity/acp-policy.entity';
import { Exclude, plainToInstance, Transform } from 'class-transformer';

export class AcpRoleAuthSerialization {
  @Transform(({ value }) => plainToInstance(AcpPolicyAuthSerialization, value))
  readonly policy: AcpPolicy;

  readonly isActive: boolean;

  @Exclude()
  readonly id: string;

  @Exclude()
  readonly createdAt: Date;

  @Exclude()
  readonly updatedAt: Date;

  @Exclude()
  readonly deletedAt: Date;
}
