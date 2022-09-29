import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class IdParamDto {
  @IsNotEmpty()
  @IsUUID()
  @Type(() => String)
  @ApiProperty({ required: false })
  readonly id!: string;
}
