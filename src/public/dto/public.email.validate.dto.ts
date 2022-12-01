import {
  EmptyStringToUndefinedTransform,
  NormalizeEmail,
} from '@/utils/request/transform';
import { IsIsAcceptableEmail } from '@/utils/request/validation';

export class PublicEmailValidateDto {
  @IsIsAcceptableEmail()
  @NormalizeEmail()
  @EmptyStringToUndefinedTransform()
  readonly value!: string;
}
