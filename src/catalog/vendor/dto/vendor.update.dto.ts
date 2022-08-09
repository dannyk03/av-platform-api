import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsUUID,
  Length,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import { ProductSKU } from '@/catalog/catalog.decorator';

import { ProductUpdateDisplayDto } from '@/catalog/product/dto';

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
