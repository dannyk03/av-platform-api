import { Escape, NormalizeEmail, Trim } from 'class-sanitizer';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
export class OrganizationInviteDto {
  @MaxLength(50)
  @IsEmail()
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
