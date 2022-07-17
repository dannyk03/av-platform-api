import { Transform } from 'class-transformer';
import { Escape, Trim } from 'class-sanitizer';
import {
  IsNotEmpty,
  IsEmail,
  ArrayMaxSize,
  ArrayMinSize,
  MaxLength,
} from 'class-validator';
import { isArray } from 'lodash';

export class GiftSendDto {
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @MaxLength(50, { each: true })
  @IsEmail(undefined, { each: true })
  @Trim(undefined, { each: true })
  @Escape({ each: true })
  @Transform(({ value }) => {
    return isArray(value) ? value : [value];
  })
  recipients: string[];
}
