import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Length,
} from 'class-validator';

import { NormalizeStringInput } from '@/utils/request/transform';

export class VendorUpdateDto {
  @IsNotEmpty()
  @IsUUID()
  @Type(() => String)
  readonly id: string;

  @Length(3, 30)
  @IsOptional()
  @IsNotEmpty()
  @NormalizeStringInput()
  @Type(() => String)
  readonly name?: string;

  @Length(3, 200)
  @IsOptional()
  @IsNotEmpty()
  @NormalizeStringInput()
  readonly description!: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
