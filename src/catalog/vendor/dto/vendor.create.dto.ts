import { IsBoolean, IsOptional, Length } from 'class-validator';

import { NormalizeStringInputTransform } from '@/utils/request/transform';

export class VendorCreateDto {
  @Length(3, 30)
  @NormalizeStringInputTransform()
  readonly name!: string;

  @Length(3, 200)
  @IsOptional()
  @NormalizeStringInputTransform()
  readonly description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
