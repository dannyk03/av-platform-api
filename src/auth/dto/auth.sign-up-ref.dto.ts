import { ApiProperty } from '@nestjs/swagger';

import { EnumNetworkingConnectionType } from '@avo/type';

import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export class AuthSignUpRefDto {
  @IsOptional()
  @IsUUID()
  @Type(() => String)
  @ApiProperty()
  readonly ref: string;

  @IsOptional()
  @IsEnum(EnumNetworkingConnectionType)
  @Type(() => String)
  @ApiProperty()
  readonly type: EnumNetworkingConnectionType;
}
