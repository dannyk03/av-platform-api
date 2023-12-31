import { Type } from 'class-transformer';
import { IsOptional, IsString, Length, MaxLength } from 'class-validator';

import {
  ConsecutiveWhitespaceTransform,
  NormalizeStringInputTransform,
} from '@/utils/request/transform';

export class GroupCreateDto {
  @IsString()
  @Length(3, 300)
  @IsString()
  @ConsecutiveWhitespaceTransform()
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly name!: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly description?: string;
}
