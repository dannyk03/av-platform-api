import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class IdParamDto {
  @IsNotEmpty()
  @IsUUID()
  @Type(() => String)
  readonly id!: string;
}
