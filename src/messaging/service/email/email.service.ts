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
  }: {
    email: string;
    inviteCode: string;
    expiresInDays: number;
  }): Promise<boolean> {
    // TODO email send logic and return Boolean if succeeded
    console.log({ email, inviteCode, expiresInDays });
    return Boolean('success');
  }
}
