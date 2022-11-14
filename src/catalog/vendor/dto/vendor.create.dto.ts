import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

import { NormalizeStringInputTransform } from '@/utils/request/transform';

export class VendorCreateDto {
  @Length(3, 30)
  @IsString()
  @NormalizeStringInputTransform()
  readonly name!: string;

  @Length(3, 200)
  @IsOptional()
  @IsString()
  @NormalizeStringInputTransform()
  readonly description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
