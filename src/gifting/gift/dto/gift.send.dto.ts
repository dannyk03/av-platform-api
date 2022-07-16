import { Transform, Type } from 'class-transformer';
import { Escape, Trim } from 'class-sanitizer';
import {
  IsNotEmpty,
  IsEmail,
  ArrayMaxSize,
  ArrayMinSize,
} from 'class-validator';
import { isArray } from 'lodash';

export class GiftSendDto {
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @Transform(({ value }) => {
    return isArray(value) ? value : [value];
  })
  @IsEmail(undefined, { each: true })
  @Trim(undefined, { each: true })
  @Escape({ each: true })
  email: string[];
}
