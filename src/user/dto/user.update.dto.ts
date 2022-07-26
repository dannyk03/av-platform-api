import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class UserUpdateDto {
  @IsOptional()
  @IsNotEmpty()
  @IsNotEmpty()
  @MaxLength(30)
  @Type(() => String)
  readonly firstName?: string;

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(30)
  @Type(() => String)
  readonly lastName?: string;
}
