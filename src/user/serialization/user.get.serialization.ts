import { Exclude, Transform, Type } from 'class-transformer';
import { IAwsS3Response } from 'src/aws/aws.interface';
// import { IRoleEntity } from 'src/role/role.interface';

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
  // readonly role: IRoleEntity;
  readonly email: string;
  readonly mobileNumber: string;
  readonly isActive: boolean;
  readonly firstName: string;
  readonly lastName: string;
  readonly photo?: IAwsS3Response;

  @Exclude()
  readonly password: string;

  readonly passwordExpired: Date;

  @Exclude()
  readonly salt: string;

  readonly createdAt: Date;

  @Exclude()
  readonly updatedAt: Date;
}
