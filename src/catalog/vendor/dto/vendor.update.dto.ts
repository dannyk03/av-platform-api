import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

import { NormalizeStringInputTransform } from '@/utils/request/transform';

export class VendorUpdateDto {
  @IsNotEmpty()
  @IsUUID()
  @Type(() => String)
  readonly id: string;

  @Length(3, 30)
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly name?: string;

  @Length(3, 200)
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @NormalizeStringInputTransform()
  readonly description!: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
