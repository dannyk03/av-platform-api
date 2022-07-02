import { IsString, IsNotEmpty, Length } from 'class-validator';

export class OrganizationInviteValidateDto {
  @IsString()
  @IsNotEmpty()
  @Length(32, 32)
  readonly inviteCode: string;
}
