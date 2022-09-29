import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsOptional, IsUUID } from 'class-validator';

export class AuthSignUpRefDto {
  @IsOptional()
  @IsUUID()
  @Type(() => String)
  @ApiProperty()
  readonly ref: string;
}
