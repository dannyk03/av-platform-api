import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ProductDeleteDto {
  @IsNotEmpty()
  @IsUUID()
  @Type(() => String)
  readonly id!: string;
}
