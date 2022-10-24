import { ApiProperty } from '@nestjs/swagger';

import { EnumNetworkingConnectionType } from '@avo/type';

import { Type } from 'class-transformer';
import { IsOptional, IsUUID } from 'class-validator';

export class AuthSignUpRefDto {
  @IsOptional()
  @IsUUID()
  @Type(() => String)
  @ApiProperty()
  readonly ref: string;

  @IsOptional()
  @Type(() => Number)
  @ApiProperty()
  readonly type: EnumNetworkingConnectionType;
}
