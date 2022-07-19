import { Exclude, Expose } from 'class-transformer';
@Exclude()
export class AuthConfigLoginSerialization {
  @Expose()
  readonly passwordExpiredAt: Date;
}
