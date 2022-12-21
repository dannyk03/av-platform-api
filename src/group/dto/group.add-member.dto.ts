import { ApiProperty } from '@nestjs/swagger';

import { EnumAddGroupMemberType } from '@avo/type';

import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';

export class GroupInviteAcceptRefDto {
  @IsOptional()
  @Length(21, 21)
  @IsString()
  @Type(() => String)
  @ApiProperty()
  readonly code: string;

  @IsOptional()
  @IsEnum(EnumAddGroupMemberType)
  @Type(() => Number)
  @ApiProperty()
  readonly type: EnumAddGroupMemberType;
}

export class GroupInviteAcceptByIdDto {
  @IsOptional()
  @IsString()
  @Type(() => String)
  @ApiProperty()
  readonly inviteId: string;
}
