import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ProductIdQueryParamDto {
  @IsNotEmpty()
  @IsUUID()
  @Type(() => String)
  readonly id!: string;
}
