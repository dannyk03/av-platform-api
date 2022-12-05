import { ApiProperty } from '@nestjs/swagger';

import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { isArray } from 'lodash';

import {
  NormalizeEmail,
  UniqueArrayByTransform,
} from '@/utils/request/transform';

class MemberDto {
  @NormalizeEmail()
  readonly email: string;
}

export class GroupInviteMemberDto {
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @IsNotEmpty({ each: true })
  @IsObject({ each: true })
  @IsArray()
  @Transform(({ value }) => {
    return isArray(value) ? value : [value];
  })
  @UniqueArrayByTransform('email')
  @ValidateNested()
  @Type(() => MemberDto)
  @ApiProperty()
  readonly members: MemberDto[];
}
