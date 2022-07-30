import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ProductIdParamDto {
  @IsNotEmpty()
  @IsUUID()
  @Type(() => String)
  readonly id!: string;
}
