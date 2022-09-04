import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import {
  ArrayTransform,
  UniqueArrayByTransform,
} from '@/utils/request/transform';

export class UserInviteAddresseeDtoDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Type(() => String)
  readonly personalNote?: string;
}

export class UserInviteDto {
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @IsArray()
  @IsNotEmpty({ each: true })
  @UniqueArrayByTransform('email')
  @ArrayTransform()
  @Type(() => UserInviteAddresseeDtoDto)
  readonly addressees: UserInviteAddresseeDtoDto[];

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Type(() => String)
  readonly personalNote?: string;
}
