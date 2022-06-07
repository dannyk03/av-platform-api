import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { ENUM_PERMISSIONS } from '@/permission/permission.constant';

export class RoleCreateDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  @Type(() => String)
  readonly name: string;

  @IsEnum(ENUM_PERMISSIONS, { each: true })
  @IsNotEmpty()
  readonly permissions: ENUM_PERMISSIONS[];

  // @IsBoolean()
  // @IsNotEmpty()
  // readonly isAdmin: boolean;
}
