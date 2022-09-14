import { NormalizeEmail } from '@/utils/request/transform';

export class AuthResendSignupEmailDto {
  @NormalizeEmail()
  readonly email!: string;
}
