import { Inject, Injectable, Request } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';

import { GiftIntent } from '@/gifting/entity';
import { User } from '@/user/entity';

import { CustomerIOService } from '../../customer-io/service/customer-io.service';

import { IRequestApp } from '@/utils/request/type';

import {
  ConnectionRequestExistingUserMessageData,
  ConnectionRequestMessageData,
  ConnectionRequestNewUserMessageData,
  EmailStatus,
  EmailTemplate,
  GiftDeliveredToRecipientMessageData,
  GiftDetails,
  GiftOption,
  GiftOptionSelectMessageData,
  GiftShippingDetails,
  GiftStatusUpdateMessageData,
  SurveyCompletedMessageData,
  SurveyInvitationMessageData,
} from '../email.constant';

@Injectable()
export class EmailService {
  private readonly origin: string = this.request.get('origin');
  private readonly isDevelopment: boolean =
    this.configService.get<boolean>('app.isDevelopment');

  constructor(
    @Inject(REQUEST)
    private readonly request: Request & IRequestApp,
    private readonly configService: ConfigService,
    private readonly customerIOService: CustomerIOService,
  ) {}

  async sendNetworkJoinInvite({
    email,
    fromUser,
    personalNote,
  }: {
    email: string;
    fromUser: User;
    personalNote: string;
  }) {
    // Stub for local development
    if (this.isDevelopment) {
      return true;
    }

    // TODO: Verify template parameters
    const sendResult = await this.customerIOService.sendEmail({
      template: EmailTemplate.SendNetworkInvite.toString(),
      to: [email],
      emailTemplatePayload: {
        ref: fromUser.id,
        personalNote,
        transport: {
          origin: this.origin,
        },
      },
      identifier: { id: email },
    });
    console.log({ email, ref: fromUser.id });
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
    const approvePath = `/network/approve?ref=${fromUser.id}`;
    const rejectPath = `/network/reject?ref=${fromUser.id}`;
    // Stub for local development
    if (this.isDevelopment) {
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
        transport: {
          origin: this.origin,
        },
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
    // Stub for local development
    if (this.isDevelopment) {
      return true;
    }

    // TODO: Verify template parameters
    const sendResult = await this.customerIOService.sendEmail({
      template: EmailTemplate.SendOrganizationInvite.toString(),
      to: [email],
      emailTemplatePayload: {
        organizationName,
        path,
        transport: {
          origin: this.origin,
        },
      },
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
    // Stub for local development
    if (this.isDevelopment) {
      return true;
    }

    // TODO: Add server url to payload
    const sendResult = await this.customerIOService.sendEmail({
      template: EmailTemplate.SendSignUpEmailVerification.toString(),
      to: [email],
      emailTemplatePayload: {
        path,
        activationCode: code,
        user: { firstName },
        transport: {
          origin: this.origin,
        },
      },
      identifier: { id: email },
    });
    console.log({ email, code, expiresInDays, path });
    return sendResult.status === EmailStatus.success;
  }

  async sendResetPassword({
    email,
    firstName,
    code,
  }: {
    email: string;
    code: string;
    // emailTemplatePayload: ResetPasswordMessageData; // TODO: consider if best to use the type here or just internally
    firstName: string;
    path?: string;
  }): Promise<boolean> {
    // Stub for local development
    if (this.isDevelopment) {
      return true;
    }

    const sendResult = await this.customerIOService.sendEmail({
      template: EmailTemplate.SendResetPassword.toString(),
      to: [email],
      emailTemplatePayload: {
        code,
        user: {
          firstName: firstName,
        },
        transport: {
          origin: this.origin,
        },
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
    // Stub for local development
    if (this.isDevelopment) {
      return true;
    }

    // TODO: Verify template parameters
    const sendResult = await this.customerIOService.sendEmail({
      template: EmailTemplate.SendGiftSurvey.toString(),
      to: [recipientEmail],
      emailTemplatePayload: {
        recipientEmail,
        senderEmail,
        path,
        transport: {
          origin: this.origin,
        },
      },
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
    // Stub for local development
    if (this.isDevelopment) {
      return true;
    }

    // TODO: Verify template parameters
    const sendResult = await this.customerIOService.sendEmail({
      template: EmailTemplate.SendGiftConfirm.toString(),
      to: [email],
      emailTemplatePayload: {
        path,
        code,
        transport: {
          origin: this.origin,
        },
      },
      identifier: { id: email },
    });
    console.log({
      path,
      email,
      code,
    });
    return sendResult.status === EmailStatus.success;
  }

  async sendGiftOptionSelect({
    giftIntent,
    email,
    code,
  }: {
    giftIntent: GiftIntent;
    email: string;
    code: string;
  }): Promise<boolean> {
    // Stub for local development
    if (this.isDevelopment) {
      return true;
    }
    // TODO remove all [0], and implement with localization and bundles
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
      giftIntentId: giftIntent.id,
      giftOptions,
    };

    const sendResult = await this.customerIOService.sendEmail({
      template: EmailTemplate.SendGiftSelection.toString(),
      to: [email],
      emailTemplatePayload: {
        ...payload,
        transport: {
          origin: this.origin,
        },
      },
      identifier: { id: email },
    });

    return sendResult.status === EmailStatus.success;
  }

  async sendGiftShipped({
    email,
    giftIntent,
  }: {
    // Recipient email
    email: string;
    giftIntent: GiftIntent;
  }): Promise<boolean> {
    // Stub for local development
    if (this.isDevelopment) {
      return true;
    }

    // TODO: Verify template parameters
    const sendResult = await this.customerIOService.sendEmail({
      template: EmailTemplate.SendGiftShipped.toString(),
      to: [email],
      emailTemplatePayload: {
        from: giftIntent?.sender?.user?.profile?.firstName,
        transport: {
          origin: this.origin,
        },
      },
      identifier: { id: email },
    });
    return sendResult.status === EmailStatus.success;
  }

  getGiftStatusUpdateMessageData(giftIntent: GiftIntent) {
    const giftDetails: GiftDetails = {
      productName:
        giftIntent.giftSubmit.gifts[0].products[0].displayOptions[0].name,
      imageUrl:
        giftIntent.giftSubmit.gifts[0].products[0].displayOptions[0].images[0]
          .secureUrl,
      formattedPrice: `$${giftIntent.giftSubmit.gifts[0].products[0].price}`, // TODO: verify the unit of mesure + add symbols '.' , ','
      personalNote: giftIntent.giftSubmit.personalNote,
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
    giftIntent,
  }: {
    email: string;
    giftIntent: GiftIntent;
  }): Promise<boolean> {
    // Stub for local development
    if (this.isDevelopment) {
      return true;
    }

    const sendResult = await this.customerIOService.sendEmail({
      template: EmailTemplate.SendSenderGiftIsOnItsWay.toString(),
      to: [email],
      emailTemplatePayload: {
        ...this.getGiftStatusUpdateMessageData(giftIntent),
        transport: {
          origin: this.origin,
        },
      },
      identifier: { id: email },
    });
    return sendResult.status === EmailStatus.success;
  }

  async sendSenderTheGiftDelivered({
    email,
    giftIntent,
  }: {
    // Sender email
    email: string;
    giftIntent: GiftIntent;
  }): Promise<boolean> {
    // Stub for local development
    if (this.isDevelopment) {
      return true;
    }

    const sendResult = await this.customerIOService.sendEmail({
      template: EmailTemplate.SendSenderGiftDelivered.toString(),
      to: [email],
      emailTemplatePayload: {
        recipient: {
          firstName: giftIntent?.recipient?.user?.profile?.firstName,
          shipping: {
            addressLine1:
              giftIntent?.recipient?.user?.profile?.shipping?.addressLine1,
            addressLine2:
              giftIntent?.recipient?.user?.profile?.shipping?.addressLine2,
            city: giftIntent?.recipient?.user?.profile?.shipping?.city,
            country: giftIntent?.recipient?.user?.profile?.shipping?.country,
            state: giftIntent?.recipient?.user?.profile?.shipping?.state,
            zipCode: giftIntent?.recipient?.user?.profile?.shipping?.zipCode,
          },
        },
        gift: {
          productName:
            giftIntent.giftSubmit?.gifts[0]?.products[0]?.displayOptions[0]
              ?.name,
          imageUrl:
            giftIntent.giftSubmit?.gifts[0].products[0].displayOptions[0]
              .images[0].secureUrl,
          formattedPrice: `$${giftIntent.giftSubmit?.gifts[0].products[0].price}`,
          personalNote: giftIntent?.giftSubmit?.personalNote,
        },
        transport: {
          origin: this.origin,
        },
      },
      identifier: { id: email },
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
    // Stub for local development
    if (this.isDevelopment) {
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
      emailTemplatePayload: {
        ...payload,
        transport: {
          origin: this.origin,
        },
      },
      identifier: { id: email },
    });
    console.log({
      email,
    });
    return sendResult.status === EmailStatus.success;
  }

  getConnectionRequestAcceptedMessageData({
    requestingUserName,
    receivingUserName,
    connectionId,
    personalNote,
  }: {
    requestingUserName: string;
    receivingUserName: string;
    connectionId: string;
    personalNote: string;
  }) {
    const payload: ConnectionRequestMessageData = {
      requestingUser: {
        firstName: requestingUserName,
      },
      receivingUser: {
        firstName: receivingUserName,
      },
      personalNote,
      connectionViewLink: '', // TODO: add / build here using `connectionId`
    };
    return payload;
  }

  async sendConnectionRequestAccepted({
    email,
    requestingUserName,
    receivingUserName,
    connectionId,
    personalNote,
  }: {
    email: string;
    requestingUserName: string;
    receivingUserName: string;
    connectionId: string;
    personalNote: string;
  }): Promise<boolean> {
    // Stub for local development
    if (this.isDevelopment) {
      return true;
    }

    const payload = this.getConnectionRequestAcceptedMessageData({
      requestingUserName,
      receivingUserName,
      connectionId,
      personalNote,
    });

    const sendResult = await this.customerIOService.sendEmail({
      template: EmailTemplate.SendConnectionRequestAccepted.toString(),
      to: [email],
      emailTemplatePayload: {
        ...payload,
        transport: {
          origin: this.origin,
        },
      },
      identifier: { id: email },
    });
    console.log({
      email,
      payload,
    });
    return sendResult.status === EmailStatus.success;
  }

  async sendConnectionRequestNewUser({
    email,
    requestingUser,
    personalNote,
    connectionId,
  }: {
    email: string;
    requestingUser: User;
    personalNote: string;
    connectionId: string;
  }): Promise<boolean> {
    // Stub for local development
    if (this.isDevelopment) {
      return true;
    }

    const payload: ConnectionRequestNewUserMessageData = {
      requestingUser: {
        firstName: requestingUser.profile.firstName,
      },
      personalNote,
      connectionId,
    };

    const sendResult = await this.customerIOService.sendEmail({
      template: EmailTemplate.SendConnectionRequestNewUser.toString(),
      to: [email],
      emailTemplatePayload: {
        ...payload,
        transport: {
          origin: this.origin,
        },
      },
      identifier: { id: email },
    });
    console.log({
      email,
      payload,
    });
    return sendResult.status === EmailStatus.success;
  }

  async sendConnectionRequestExistingUser({
    email,
    requestingUser,
    receivingUser,
    connectionId,
    personalNote,
  }: {
    email: string;
    requestingUser: User;
    receivingUser: User;
    connectionId: string;
    personalNote: string;
  }): Promise<boolean> {
    if (!this.isDevelopment) {
      return true;
    }
    const payload: ConnectionRequestExistingUserMessageData = {
      requestingUser: {
        firstName: requestingUser.profile.firstName,
      },
      receivingUser: {
        firstName: receivingUser.profile.firstName,
      },
      connectionApproveLink: '',
      connectionRejectLink: '',
      connectionId,
    };

    const sendResult = await this.customerIOService.sendEmail({
      template: EmailTemplate.SendConnectionRequestExistingUser.toString(),
      to: [email],
      emailTemplatePayload: {
        ...payload,
        transport: {
          origin: this.origin,
        },
      },
      identifier: { id: email },
    });
    console.log({
      email,
      payload,
    });
    return sendResult.status === EmailStatus.success;
  }

  async sendSurveyInvitation({
    email,
    inviteeUserName,
    inviterUserName,
    personalNote,
  }: {
    email: string;
    inviteeUserName: string;
    inviterUserName: string;
    personalNote: string;
  }): Promise<boolean> {
    // Stub for local development
    if (this.isDevelopment) {
      return true;
    }

    const payload: SurveyInvitationMessageData = {
      inviteeUser: {
        firstName: inviteeUserName,
      },
      inviterUser: {
        firstName: inviterUserName,
      },
      surveyLink: '',
      personalNote: '',
    };

    const sendResult = await this.customerIOService.sendEmail({
      template: EmailTemplate.SendGiftSurvey.toString(),
      to: [email],
      emailTemplatePayload: {
        ...payload,
        transport: {
          origin: this.origin,
        },
      },
      identifier: { id: email },
    });
    console.log({
      email,
      payload,
    });
    return sendResult.status === EmailStatus.success;
  }

  async sendSurveyCompletedToInviter({
    inviteeUser,
    inviterUser,
    socialConnectionRequestId,
  }: {
    inviteeUser: User;
    inviterUser: User;
    socialConnectionRequestId: string;
  }): Promise<boolean> {
    // Stub for local development
    if (this.isDevelopment) {
      return true;
    }

    const payload: SurveyCompletedMessageData = {
      inviteeUser: {
        firstName: inviteeUser.profile.firstName,
        id: inviteeUser.id,
      },
      inviterUser: {
        firstName: inviterUser.profile.firstName,
      },
      socialConnectionRequestId,
    };

    const sendResult = await this.customerIOService.sendEmail({
      template: EmailTemplate.SendSurveyCompleted.toString(),
      to: [inviterUser.email],
      emailTemplatePayload: {
        ...payload,
        transport: {
          origin: this.origin,
        },
      },
      identifier: { id: inviterUser.email },
    });
    console.log({
      payload,
    });
    return sendResult.status === EmailStatus.success;
  }
}
