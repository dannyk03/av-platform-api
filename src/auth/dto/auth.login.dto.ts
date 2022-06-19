import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsEmail,
  MaxLength,
  IsBoolean,
  IsOptional,
  IsString,
} from 'class-validator';

export class AuthLoginDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  readonly email: string;

  @IsOptional()
  @IsBoolean()
  readonly rememberMe?: boolean;

  @IsNotEmpty()
  @Type(() => String)
  @IsString()
  readonly password: string;
}
