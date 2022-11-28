import { IsNotEmpty } from 'class-validator';

import { PhoneNumber } from '@/utils/request/decorator';

import {
  EmptyStringToUndefinedTransform,
  NormalizeStringInputTransform,
} from '@/utils/request/transform';

export class PublicPhoneNumberValidateDto {
  @IsNotEmpty()
  @EmptyStringToUndefinedTransform()
  @PhoneNumber()
  @NormalizeStringInputTransform()
  readonly value!: string;
}
