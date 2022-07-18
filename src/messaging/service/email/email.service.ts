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
    path = '/join',
  }: {
    email: string;
    inviteCode: string;
    organizationName: string;
    expiresInDays: number;
    path?: string;
  }): Promise<boolean> {
    // TODO email send logic and return Boolean if succeeded

    console.log({ email, inviteCode, expiresInDays, organizationName, path });
    return Boolean('success');
  }

  async sendSignUpEmailVerification({
    email,
    signUpCode,
    expiresInDays,
    path = '/signup',
  }: {
    email: string;
    signUpCode: string;
    expiresInDays: number;
    path?: string;
  }): Promise<boolean> {
    // TODO email send logic and return Boolean if succeeded

    console.log({ email, signUpCode, expiresInDays, path });
    return Boolean('success');
  }

  // async sendGiftSurvey({
  //   email,
  //   senderEmail,
  // }: {
  //   email: string;
  //   senderEmail: string;
  // }): Promise<boolean> {
  //   // TODO email send logic and return Boolean if succeeded

  //   console.log({
  //     email,
  //     senderEmail,
  //   });
  //   return Boolean('success');
  // }

  async sendGiftVerify({
    email,
    verifyCode,
    path = '/verify',
  }: {
    email: string;
    verifyCode: string;
    path?: string;
  }): Promise<boolean> {
    // TODO email send logic and return Boolean if succeeded

    console.log({
      path,
      email,
      verifyCode,
    });
    return Boolean('success');
  }
}
