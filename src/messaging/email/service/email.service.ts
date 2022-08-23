import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GiftIntent } from '@/gifting/entity';
import { User } from '@/user/entity';

import { CustomerIOService } from '../../customer-io/service/customer-io.service';

import {
  EmailStatus,
  EmailTemplate,
  SignUpEmailVerificationMessageData,
} from '../email.constant';

@Injectable()
export class EmailService {
  private readonly isProduction: boolean;
  constructor(
    private readonly configService: ConfigService,
    private readonly customerIOService: CustomerIOService,
  ) {
    this.isProduction = this.configService.get<boolean>('app.isProduction');
  }

  async sendNetworkJoinInvite({
    email,
    fromUser,
  }: {
    email: string;
    fromUser: User;
  }) {
    const path = '/network/join';
    // Temporary for local development
    if (!this.isProduction) {
      return true;
    }

    // TODO: Verify template parameters
    const sendResult = await this.customerIOService.sendEmail({
      template: EmailTemplate.SendNetworkInvite.toString(),
      to: [email],
      emailTemplatePayload: { from: fromUser.email, path },
      identifier: { id: email },
    });
    console.log({ email, path });
    return sendResult.status === EmailStatus.success;
  }

  async sendNetworkNewConnectionRequest({
    email,
    fromUser,
  }: {
    email: string;
    fromUser: User;
    path?: string;
  }) {
    const approvePath = `/network/approve?email=${fromUser.email}`;
    const rejectPath = `/network/reject?email=${fromUser.email}`;
    // Temporary for local development
    if (!this.isProduction) {
      return true;
    }

    // TODO: Verify template parameters
    const sendResult = await this.customerIOService.sendEmail({
      template: EmailTemplate.SendNetworkNewConnectionRequest.toString(),
      to: [email],
      emailTemplatePayload: { from: fromUser.email, approvePath, rejectPath },
      identifier: { id: email },
    });
    console.log({ email, approvePath, rejectPath });
    return sendResult.status === EmailStatus.success;
  }

  async sendOrganizationInvite({
    email,
    code,
    expiresInDays,
    organizationName,
    path = 'org/join',
  }: {
    email: string;
    code: string;
    organizationName: string;
    expiresInDays: number;
    path?: string;
  }): Promise<boolean> {
    // Temporary for local development
    if (!this.isProduction) {
      return true;
    }
    // TODO: Verify template parameters
    const sendResult = await this.customerIOService.sendEmail({
      template: EmailTemplate.SendOrganizationInvite.toString(),
      to: [email],
      emailTemplatePayload: { organizationName, path },
      identifier: { id: email },
    });
    console.log({ email, code, expiresInDays, organizationName, path });
    return sendResult.status === EmailStatus.success;
  }

  async sendSignUpEmailVerification({
    email,
    firstName,
    code,
    expiresInDays,
    path = '/signup',
  }: {
    email: string;
    firstName: string;
    code: string;
    expiresInDays: number;
    path?: string;
  }): Promise<boolean> {
    // Temporary for local development
    if (!this.isProduction) {
      return true;
    }
    const sendResult = await this.customerIOService.sendEmail({
      template: EmailTemplate.SendSignUpEmailVerification.toString(),
      to: [email],
      emailTemplatePayload: { path, activationCode: code, user: { firstName } },
      identifier: { id: email },
    });
    console.log({ email, code, expiresInDays, path });
    return sendResult.status === EmailStatus.success;
  }

  async sendGiftSurvey({
    recipientEmail,
    senderEmail,
    path = '/survey',
  }: {
    recipientEmail: string;
    senderEmail: string;
    path?: string;
  }): Promise<boolean> {
    // TODO: Verify template parameters
    const sendResult = await this.customerIOService.sendEmail({
      template: EmailTemplate.SendGiftSurvey.toString(),
      to: [recipientEmail],
      emailTemplatePayload: { recipientEmail, senderEmail, path },
      identifier: { id: recipientEmail },
    });
    console.log({
      recipientEmail,
      senderEmail,
      path,
    });
    return sendResult.status === EmailStatus.success;
  }

  async sendGiftConfirm({
    email,
    code,
    path = '/confirm',
  }: {
    email: string;
    code: string;
    path?: string;
  }): Promise<boolean> {
    if (!this.isProduction) {
      return true;
    }
    // TODO: Verify template parameters
    const sendResult = await this.customerIOService.sendEmail({
      template: EmailTemplate.SendGiftConfirm.toString(),
      to: [email],
      emailTemplatePayload: { path, code },
      identifier: { id: email },
    });
    console.log({
      path,
      email,
      code,
    });
    return sendResult.status === EmailStatus.success;
  }

  async sendGiftReadyForSubmit({
    giftIntent,
    email,
    code,
    path = '/ready',
  }: {
    giftIntent: GiftIntent;
    email: string;
    code: string;
    path?: string;
  }): Promise<boolean> {
    if (!this.isProduction) {
      return true;
    }
    // TODO: Verify template parameters
    const sendResult = await this.customerIOService.sendEmail({
      template: EmailTemplate.SendGiftOptions.toString(),
      to: [email],
      emailTemplatePayload: { path, code },
      identifier: { id: email },
    });
    console.log({
      path,
      email,
      code,
    });
    return sendResult.status === EmailStatus.success;
  }
}
