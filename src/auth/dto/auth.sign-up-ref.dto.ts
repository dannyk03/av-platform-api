import { Type } from 'class-transformer';
import { IsOptional, IsUUID } from 'class-validator';

export class AuthSignUpRefDto {
  @IsOptional()
  @IsUUID()
  @Type(() => String)
  readonly ref: string;
}
