import { IsString, IsNotEmpty, IsEmail, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { Escape, Trim } from 'class-sanitizer';
export class OrganizationInviteDto {
  @IsEmail()
  @MaxLength(50)
  @Transform(({ value }) => value.toLowerCase())
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
