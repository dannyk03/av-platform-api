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
  @Transform(({ value }) => {
    return isArray(value) ? value : [value];
  })
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @IsEmail(undefined, { each: true })
  // @Transform(({ value }) => value.toLowerCase())
  @Escape({ each: true })
  email: string[];
}
