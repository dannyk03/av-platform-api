import { Escape, Trim } from 'class-sanitizer';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class MagicLinkDto {
  @IsString()
  @IsNotEmpty()
  @Length(21, 21)
  @Trim()
  @Escape()
  @Type(() => String)
  readonly code: string;
}
