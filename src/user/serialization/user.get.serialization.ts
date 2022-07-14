import { Exclude, Transform, Type } from 'class-transformer';
import { IAwsS3Response } from '@/aws/aws.interface';
// import { IRoleEntity } from '@/role/role.interface';

export class UserGetSerialization {
  @Type(() => String)
  readonly id: string;

  @Transform(
    ({ value }) => ({
      name: value.name,
      permissions: value.permissions.map((val: Record<string, any>) => ({
        name: val.name,
        isActive: val.isActive,
      })),
      isActive: value.isActive,
    }),
    { toClassOnly: true },
  )
  readonly email: string;
  readonly phoneNumber: string;
  readonly isActive: boolean;
  readonly firstName: string;
  readonly lastName: string;
  readonly photo?: IAwsS3Response;

  // readonly passwordExpired: Date;

  @Exclude()
  readonly password: string;

  @Exclude()
  readonly salt: string;

  @Exclude()
  readonly createdAt: Date;

  @Exclude()
  readonly updatedAt: Date;
}
