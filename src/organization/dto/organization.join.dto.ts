import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import { IsPasswordStrong } from '@/utils/request/validation/request.is-password-strong.validation';

export class OrganizationJoinDto {
  @IsString()
  @IsOptional()
  @MaxLength(30)
  readonly firstName: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  readonly lastName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  @IsPasswordStrong()
  readonly password: string;
}
