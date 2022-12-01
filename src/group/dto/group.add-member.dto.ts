import { ApiProperty } from '@nestjs/swagger';

import { EnumAddGroupMemberType } from '@avo/type';

import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class GroupAddMemberDto {
  @IsUUID()
  @ApiProperty()
  readonly groupId: string;
}

export class GroupAddMemberRefDto {
  @IsNotEmpty()
  @Length(21, 21)
  @IsString()
  @Type(() => String)
  @ApiProperty()
  readonly inviteCode: string;

  @IsOptional()
  @IsEnum(EnumAddGroupMemberType)
  @Type(() => Number)
  @ApiProperty()
  readonly type: EnumAddGroupMemberType;
}
