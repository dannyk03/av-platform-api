import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

import {
  NormalizeEmail,
  NormalizeStringInputTransform,
} from '@/utils/request/transform';

export class OrganizationInviteDto {
  @NormalizeEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  @NormalizeStringInputTransform()
  // Can be role.slug or role.id
  readonly role: string;
}
