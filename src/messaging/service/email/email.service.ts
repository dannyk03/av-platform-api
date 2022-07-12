import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// Services
import { DebuggerService } from '@/debugger/service';
//

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly debuggerService: DebuggerService,
  ) {}

  async sendOrganizationInvite({
    email,
    inviteCode,
    expiresInDays,
    organizationName,
  }: {
    email: string;
    inviteCode: string;
    organizationName: string;
    expiresInDays: number;
  }): Promise<boolean> {
    // TODO email send logic and return Boolean if succeeded

    console.log({ email, inviteCode, expiresInDays, organizationName });
    return Boolean('success');
  }

  async sendSignUpEmailVerification({
    email,
    signUpCode,
    expiresInDays,
  }: {
    email: string;
    signUpCode: string;
    expiresInDays: number;
  }): Promise<boolean> {
    // TODO email send logic and return Boolean if succeeded

    console.log({ email, signUpCode, expiresInDays });
    return Boolean('success');
  }

  async sendGiftSurvey({
    email,
    senderEmail,
  }: {
    email: string;
    senderEmail: string;
  }): Promise<boolean> {
    // TODO email send logic and return Boolean if succeeded

    console.log({
      email,
      senderEmail,
    });
    return Boolean('success');
  }
}
