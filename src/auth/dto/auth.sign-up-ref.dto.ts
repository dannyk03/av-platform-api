import { ApiProperty } from '@nestjs/swagger';

import { EnumNetworkingConnectionType } from '@avo/type';

import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export class AuthSignUpRefDto {
  @IsOptional()
  @Type(() => String)
  @ApiProperty()
  readonly ref: string;

  @IsOptional()
  @Type(() => String)
  @ApiProperty()
  // group ref
  readonly gref: string;

  @IsOptional()
  @Type(() => String)
  @ApiProperty()
  // connection ref
  readonly cref: string;

  @IsOptional()
  @Type(() => String)
  @ApiProperty()
  // organization ref
  readonly oref: string;

  @IsOptional()
  @IsEnum(EnumNetworkingConnectionType)
  @Type(() => Number)
  @ApiProperty()
  readonly type: EnumNetworkingConnectionType;
}
