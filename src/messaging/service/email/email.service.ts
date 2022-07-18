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
    code,
    expiresInDays,
    organizationName,
    path = '/join',
  }: {
    email: string;
    code: string;
    organizationName: string;
    expiresInDays: number;
    path?: string;
  }): Promise<boolean> {
    // TODO email send logic and return Boolean if succeeded

    console.log({ email, code, expiresInDays, organizationName, path });
    return Boolean('success');
  }

  async sendSignUpEmailVerification({
    email,
    code,
    expiresInDays,
    path = '/signup',
  }: {
    email: string;
    code: string;
    expiresInDays: number;
    path?: string;
  }): Promise<boolean> {
    // TODO email send logic and return Boolean if succeeded

    console.log({ email, code, expiresInDays, path });
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
    code,
    path = '/verify',
  }: {
    email: string;
    code: string;
    path?: string;
  }): Promise<boolean> {
    // TODO email send logic and return Boolean if succeeded

    console.log({
      path,
      email,
      code,
    });
    return Boolean('success');
  }
}
