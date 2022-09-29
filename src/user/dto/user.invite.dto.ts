import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import {
  ArrayTransform,
  NormalizeEmail,
  UniqueArrayByTransform,
} from '@/utils/request/transform';

export class UserInviteAddresseeDtoDto {
  @NormalizeEmail()
  @IsNotEmpty()
  @ApiProperty()
  readonly email: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Type(() => String)
  @ApiProperty()
  readonly personalNote?: string;
}

export class UserInviteDto {
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @IsArray()
  @IsNotEmpty({ each: true })
  @UniqueArrayByTransform('email')
  @ArrayTransform()
  @ValidateNested()
  @Type(() => UserInviteAddresseeDtoDto)
  @ApiProperty()
  readonly addressees: UserInviteAddresseeDtoDto[];

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Type(() => String)
  @ApiProperty()
  readonly personalNote?: string;
}
