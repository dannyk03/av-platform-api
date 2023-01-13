import { Type } from 'class-transformer';
import { IsString, Length } from 'class-validator';

import {
  ConsecutiveWhitespaceTransform,
  NormalizeStringInputTransform,
} from '@/utils/request/transform';

export class GroupQuestionAnswerCreateDto {
  @IsString()
  @Length(3, 300)
  @IsString()
  @ConsecutiveWhitespaceTransform()
  @NormalizeStringInputTransform()
  @Type(() => String)
  readonly data!: string;
}
