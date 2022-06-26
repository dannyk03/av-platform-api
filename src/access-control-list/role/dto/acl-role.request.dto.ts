import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class RoleRequestDto {
  @IsNotEmpty()
  @IsUUID()
  @Type(() => String)
  role: string;
}
