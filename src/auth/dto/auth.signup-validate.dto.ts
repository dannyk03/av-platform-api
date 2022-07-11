import { IsString, IsNotEmpty, Length } from 'class-validator';

export class UserSignUpValidateDto {
  @IsString()
  @IsNotEmpty()
  @Length(32, 32)
  readonly signUpCode: string;
}
