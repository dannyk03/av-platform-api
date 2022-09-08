import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  Max,
  Min,
} from 'class-validator';

export class ProductImageUpdateDto {
  @IsNotEmpty()
  @IsPositive()
  @IsOptional()
  @IsInt()
  @Max(100)
  @Min(0)
  readonly weight?: number;
}
