import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import { IsPasswordStrong } from '@/utils/request/validation/request.is-password-strong.validation';
import { Escape, Trim } from 'class-sanitizer';
import { Type } from 'class-transformer';
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
