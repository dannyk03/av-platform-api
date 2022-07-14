import { IsString, IsNotEmpty, Length } from 'class-validator';
import { Escape, Trim } from 'class-sanitizer';
export class UserSignUpValidateDto {
  @IsString()
  @IsNotEmpty()
  @Length(32, 32)
  @Trim()
  @Escape()
  readonly signUpCode: string;
}
