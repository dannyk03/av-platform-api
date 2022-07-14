import { Type } from 'class-transformer';
import { IsNotEmpty, MaxLength, IsOptional, ValidateIf } from 'class-validator';

export class UserUpdateDto {
  @IsOptional()
  @IsNotEmpty()
  @ValidateIf((e) => e.lastName !== '')
  @MaxLength(30)
  @Type(() => String)
  readonly firstName?: string;

  @IsOptional()
  @ValidateIf((e) => e.lastName !== '')
  @MaxLength(30)
  @Type(() => String)
  readonly lastName?: string;
}
