import { IsString, IsNotEmpty, IsEmail, MaxLength } from 'class-validator';
import { Escape, NormalizeEmail, Trim } from 'class-sanitizer';
export class OrganizationInviteDto {
  @IsEmail()
  @MaxLength(50)
  @NormalizeEmail(true)
  @Trim()
  @Escape()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  @Trim()
  @Escape()
  // Can be role.slug or role.id
  readonly role: string;
}
