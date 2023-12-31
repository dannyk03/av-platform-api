import { ApiProperty } from '@nestjs/swagger';

import { EnumNetworkingConnectionType } from '@avo/type';

import { Type } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

export class AuthSignUpRefDto {
  @IsOptional()
  @Type(() => String)
  @ApiProperty()
  readonly ref: string;

  @IsOptional()
  @IsEnum(EnumNetworkingConnectionType)
  @Type(() => Number)
  @ApiProperty()
  readonly type: EnumNetworkingConnectionType;
}
