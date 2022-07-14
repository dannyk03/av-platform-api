import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MaxLength,
  MinLength,
  Length,
} from 'class-validator';
import { Escape, Trim } from 'class-sanitizer';
import { Transform, Type } from 'class-transformer';
import { IsPasswordStrong } from '@/utils/request/validation/request.is-password-strong.validation';

export class OrganizationCreateDto {
  @IsEmail()
  @MaxLength(50)
  @Transform(({ value }) => value.toLowerCase())
  @Trim()
  @Escape()
  readonly email!: string;

  @MaxLength(30)
  @IsPasswordStrong()
  @Trim()
  @Type(() => String)
  readonly password!: string;

  @Length(2, 30)
  @Escape()
  @Trim()
  @Type(() => String)
  readonly name!: string;
}
