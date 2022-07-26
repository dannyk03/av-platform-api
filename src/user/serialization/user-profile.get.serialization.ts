import { IAwsS3Response } from '$/aws/aws.interface';
import { Exclude, Expose, Transform } from 'class-transformer';
// import { IRoleEntity } from '$/role/role.interface';

@Exclude()
export class UserProfileGetSerialization {
  @Expose()
  readonly id: string;

  @Expose()
  readonly email: string;

  @Expose()
  readonly phoneNumber: string;

  @Expose()
  readonly isActive: boolean;

  @Expose()
  @Transform(({ obj }) => obj.profile.firstName)
  readonly firstName: string;

  @Expose()
  @Transform(({ obj }) => obj.profile.lastName)
  readonly lastName: string;

  @Expose()
  @Transform(({ obj }) => obj.profile.title)
  readonly title: string;

  @Expose()
  @Transform(({ obj }) => obj.profile.photo)
  readonly photo?: IAwsS3Response;
}
