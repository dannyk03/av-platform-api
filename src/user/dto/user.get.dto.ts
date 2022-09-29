import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class UserRequestDto {
  @IsNotEmpty()
  @Type(() => String)
  @ApiProperty()
  user: string;
}
