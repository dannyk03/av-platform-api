import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ProductQueryParamIdDto {
  @IsNotEmpty()
  @IsUUID()
  @Type(() => String)
  readonly id!: string;
}
