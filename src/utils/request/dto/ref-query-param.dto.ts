import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class RefQueryParamOptionalDto {
  @IsNotEmpty()
  @IsUUID()
  @IsOptional()
  @Type(() => String)
  readonly ref?: string;
}
