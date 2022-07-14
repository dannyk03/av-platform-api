import {
  IsString,
  IsNotEmpty,
  Length,
  IsOptional,
  MaxLength,
  IsBoolean,
} from 'class-validator';

export class ProductCreateDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 30)
  readonly sku!: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  readonly brand?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
