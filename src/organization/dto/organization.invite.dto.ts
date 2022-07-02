import { IsString, IsNotEmpty, IsEmail, MaxLength } from 'class-validator';

export class OrganizationInviteDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(30)
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  // Can be role.slug or role.id
  readonly role: string;
}
