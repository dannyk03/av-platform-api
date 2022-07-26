import { IsPasswordStrong } from '$/utils/request/validation/request.is-password-strong.validation';
import { Escape, Trim } from 'class-sanitizer';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
export class OrganizationJoinDto {
  @IsString()
  @IsOptional()
  @MaxLength(30)
  @IsNotEmpty()
  @Trim()
  @Escape()
  @Type(() => String)
  readonly firstName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  @IsNotEmpty()
  @Trim()
  @Escape()
  @Type(() => String)
  readonly lastName?: string;

  @IsNotEmpty()
  @MaxLength(30)
  @IsPasswordStrong()
  @Trim()
  @Type(() => String)
  readonly password!: string;
}
