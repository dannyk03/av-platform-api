import { IsString, IsNotEmpty, Length } from 'class-validator';
import { Escape, Trim } from 'class-sanitizer';
import { Type } from 'class-transformer';
export class UserSignUpValidateDto {
  @IsString()
  @IsNotEmpty()
  @Length(32, 32)
  @Trim()
  @Escape()
  @Type(() => String)
  readonly code: string;
}
