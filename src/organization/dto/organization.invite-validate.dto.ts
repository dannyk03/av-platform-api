import { IsString, Length } from 'class-validator';

export class OrganizationInviteValidateDto {
  @IsString()
  @Length(32, 32)
  readonly inviteCode: string;
}
