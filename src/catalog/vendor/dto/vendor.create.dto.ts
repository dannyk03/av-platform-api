import { IsBoolean, IsOptional, Length } from 'class-validator';

import { NormalizeStringInput } from '@/utils/request/transform';

export class VendorCreateDto {
  @Length(3, 30)
  @NormalizeStringInput()
  readonly name!: string;

  @Length(3, 200)
  @IsOptional()
  @NormalizeStringInput()
  readonly description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
