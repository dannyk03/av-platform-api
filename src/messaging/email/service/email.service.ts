import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GiftIntent, GiftSubmit } from '@/gifting/entity';
import { User } from '@/user/entity';

import { CustomerIOService } from '../../customer-io/service/customer-io.service';

import {
  EmailStatus,
  EmailTemplate,
  GiftDeliveredToRecipientMessageData,
  GiftDetails,
  GiftOption,
  GiftOptionSelectMessageData,
  GiftShippingDetails,
  GiftStatusUpdateMessageData,
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
    personalNote,
  }: {
    email: string;
    fromUser: User;
    personalNote: string;
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
      emailTemplatePayload: { from: fromUser.email, path, personalNote },
      identifier: { id: email },
    });
    console.log({ email, path });
    return sendResult.status === EmailStatus.success;
  }

  async sendNetworkNewConnectionRequest({
    personalNote,
    email,
    fromUser,
  }: {
    email: string;
    fromUser: User;
    personalNote?: string;
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
      emailTemplatePayload: {
        from: fromUser.email,
        approvePath,
        rejectPath,
        personalNote,
      },
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
    // TODO: Add server url to payload
    const sendResult = await this.customerIOService.sendEmail({
      template: EmailTemplate.SendSignUpEmailVerification.toString(),
      to: [email],
      emailTemplatePayload: { path, activationCode: code, user: { firstName } },
      identifier: { id: email },
    });
    console.log({ email, code, expiresInDays, path });
    return sendResult.status === EmailStatus.success;
  }

  async sendResetPassword({
    email,
    firstName,
    path = '/reset-password',
  }: {
    email: string;
    // emailTemplatePayload: ResetPasswordMessageData; // TODO: consider if best to use the type here or just internally
    firstName: string;
    path?: string;
  }): Promise<boolean> {
    // Temporary for local development
    if (!this.isProduction) {
      return true;
    }
    // TODO: Add server url to payload
    const sendResult = await this.customerIOService.sendEmail({
      template: EmailTemplate.SendResetPassword.toString(),
      to: [email],
      emailTemplatePayload: {
        user: {
          firstName: firstName,
        },
        resetPasswordLink: '', // TODO: add link here
      },
      identifier: { id: email },
    });
    console.log({ email, firstName });
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
    const giftOptions: GiftOption[] = giftIntent.giftOptions.map(
      (giftOption) => ({
        productName: giftOption.products[0].displayOptions[0].name,
        description: giftOption.products[0].displayOptions[0].description,
        brand: giftOption.products[0].brand,
        imageUrl: giftOption.products[0].displayOptions[0].images[0].secureUrl,
      }),
    );

    const payload: GiftOptionSelectMessageData = {
      recipient: {
        firstName: giftIntent.recipient.user.profile.firstName,
      },
      sender: {
        firstName: giftIntent.sender.user.profile.firstName,
      },
      giftOptions,
      giftSelectUrl: '', // TODO: When action url is ready update here
    };

    const sendResult = await this.customerIOService.sendEmail({
      template: EmailTemplate.SendGiftSelection.toString(),
      to: [email],
      emailTemplatePayload: payload,
      identifier: { id: email },
    });

    console.log({
      path,
      email,
      code,
    });
    return sendResult.status === EmailStatus.success;
  }

  async sendGiftShipped({
    email,
    path = '/shipped',
  }: {
    email: string;
    path?: string;
  }): Promise<boolean> {
    if (!this.isProduction) {
      return true;
    }
    // TODO: Verify template parameters
    const sendResult = await this.customerIOService.sendEmail({
      template: EmailTemplate.SendGiftShipped.toString(),
      to: [email],
      emailTemplatePayload: { path },
      identifier: { id: email },
    });
    console.log({
      path,
      email,
    });
    return sendResult.status === EmailStatus.success;
  }

  getGiftStatusUpdateMessageData(giftIntent: GiftIntent) {
    const giftDetails: GiftDetails = {
      productName:
        giftIntent.giftSubmit[0].gifts[0].products[0].displayOptions[0].name,
      imageUrl:
        giftIntent.giftSubmit[0].gifts[0].products[0].displayOptions[0]
          .images[0].secureUrl,
      formattedPrice: `$${giftIntent.giftSubmit[0].gifts[0].products[0].price}`, // TODO: verify the unit of mesure + add symbols '.' , ','
      personalNote: giftIntent.giftSubmit[0].personalNote,
    };

    const shippingDetails: GiftShippingDetails = {
      shippingAddress: '', // TODO: verify we save this
      ETA: '', // TODO: verify we save this
    };

    const data: GiftStatusUpdateMessageData = {
      recipient: {
        firstName: giftIntent.recipient.user.profile.firstName,
      },
      sender: {
        firstName: giftIntent.sender.user.profile.firstName,
      },
      giftDetails,
      shippingDetails,
      sendAnotherGiftUrl: '', // TODO: When action url is ready update here
    };

    return data;
  }

  async sendSenderTheGiftIsOnItsWay({
    email,
    path = '/shipped',
    giftIntent,
  }: {
    email: string;
    path?: string;
    giftIntent: GiftIntent;
  }): Promise<boolean> {
    if (!this.isProduction) {
      return true;
    }
    const sendResult = await this.customerIOService.sendEmail({
      template: EmailTemplate.SendSenderGiftIsOnItsWay.toString(),
      to: [email],
      emailTemplatePayload: this.getGiftStatusUpdateMessageData(giftIntent),
      identifier: { id: email },
    });
    console.log({
      path,
      email,
    });
    return sendResult.status === EmailStatus.success;
  }

  async sendSenderTheGiftWasDelivered({
    email,
    giftIntent,
  }: {
    email: string;
    giftIntent: GiftIntent;
  }): Promise<boolean> {
    if (!this.isProduction) {
      return true;
    }
    const sendResult = await this.customerIOService.sendEmail({
      template: EmailTemplate.SendSenderGiftDelivered.toString(),
      to: [email],
      emailTemplatePayload: this.getGiftStatusUpdateMessageData(giftIntent),
      identifier: { id: email },
    });
    console.log({
      email,
    });
    return sendResult.status === EmailStatus.success;
  }

  async sendRecipientTheGiftWasDelivered({
    email,
    giftIntent,
  }: {
    email: string;
    giftIntent: GiftIntent;
  }): Promise<boolean> {
    if (!this.isProduction) {
      return true;
    }

    const shippingDetails: GiftShippingDetails = {
      shippingAddress: '', // TODO: verify we save this
      ETA: '', // TODO: verify we save this
    };

    const payload: GiftDeliveredToRecipientMessageData = {
      recipient: {
        firstName: giftIntent.recipient.user.profile.firstName,
      },
      sender: {
        firstName: giftIntent.sender.user.profile.firstName,
      },
      shippingDetails: shippingDetails,
      actionUrl: '', // TODO: Add here the relevant url
    };

    const sendResult = await this.customerIOService.sendEmail({
      template: EmailTemplate.SendRecipientGiftDelivered.toString(),
      to: [email],
      emailTemplatePayload: payload,
      identifier: { id: email },
    });
    console.log({
      email,
    });
    return sendResult.status === EmailStatus.success;
  }
}
