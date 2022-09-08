import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class EmailQueryParamOptionalDto {
  @IsNotEmpty()
  @IsEmail()
  @IsOptional()
  @Type(() => String)
  readonly email?: string;
}
