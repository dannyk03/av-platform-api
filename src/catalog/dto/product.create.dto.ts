import { Type } from 'class-transformer';
import { Escape, Trim } from 'class-sanitizer';
import {
  IsString,
  IsNotEmpty,
  Length,
  IsOptional,
  MaxLength,
  IsBoolean,
} from 'class-validator';

export class ProductCreateDto {
  @IsNotEmpty()
  @Length(3, 30)
  @Trim()
  @Escape()
  @Type(() => String)
  readonly sku!: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  @Trim()
  @Escape()
  readonly brand?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
