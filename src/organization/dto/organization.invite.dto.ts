import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

import {
  NormalizeEmail,
  NormalizeStringInputTransform,
} from '@/utils/request/transform';

export class OrganizationInviteDto {
  @NormalizeEmail()
  readonly email: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(36)
  @NormalizeStringInputTransform()
  // Can be role.slug or role.id
  readonly role?: string;
}
