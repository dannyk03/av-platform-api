import { Transform } from 'class-transformer';
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
  @IsEmail({ require_tld: true }, { each: true })
  email: string[];
}
