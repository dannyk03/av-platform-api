import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  ValidateNested,
} from 'class-validator';

import {
  ArrayTransform,
  NormalizeEmail,
  UniqueArrayByTransform,
} from '@/utils/request/transform';

class GroupInviteeDto {
  @NormalizeEmail()
  readonly email: string;
}

export class GroupInviteMemberDto {
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @IsArray()
  @ArrayTransform()
  @UniqueArrayByTransform('email')
  @ValidateNested({ each: true })
  @Type(() => GroupInviteeDto)
  @ApiProperty()
  readonly invitees: GroupInviteeDto[];
}
