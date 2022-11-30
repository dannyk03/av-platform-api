import { ApiProperty } from '@nestjs/swagger';

import { EnumAddGroupMemberType } from '@avo/type';

import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export class GroupAddMemberDto {
  @IsUUID()
  @ApiProperty()
  readonly groupId: string;
}

export class GroupAddMemberRefDto {
  @IsOptional()
  @IsUUID()
  @Type(() => String)
  @ApiProperty()
  readonly ref: string;

  @IsOptional()
  @IsEnum(EnumAddGroupMemberType)
  @Type(() => Number)
  @ApiProperty()
  readonly type: EnumAddGroupMemberType;
}
