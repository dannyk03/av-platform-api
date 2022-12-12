import { Inject, Injectable, Request } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';

import { GiftIntent } from '@/gifting/entity';
import { Group, GroupMember } from '@/group/entity';
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
  GiftDeliveredToSenderMessageData,
  GiftDetails,
  GiftOption,
  GiftOptionSelectMessageData,
  GiftShippingDetails,
  GiftStatusUpdateMessageData,
  GroupInviteExistingUserMessageData,
  GroupInviteNewUserMessageData,
  SurveyCompletedMessageData,
  SurveyInvitationMessageData,
} from '../constant';

import {
  getRecipientShippingDetails,
  getTheParticipatingParties,
} from '../utils';

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

  getAbbreviation(userProfile) {
    if (userProfile.firstName?.length && userProfile.lastName?.length) {
      return `${userProfile.firstName[0].toUpperCase()}${userProfile.lastName[0].toUpperCase()}`;
    }
    return null;
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
        imageUrl:
          giftOption.products[0].displayOptions[0].images[0]?.secureUrl ||
          this.configService.get<string>('default.product.imageUrl'),
      }),
    );

    const payload: GiftOptionSelectMessageData = {
      ...getTheParticipatingParties(giftIntent),
      code,
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

  getGiftOnItsWayMessageData(giftIntent: GiftIntent) {
    const giftDetails: GiftDetails = {
      productName:
        giftIntent.giftSubmit.gifts[0].products[0].displayOptions[0].name,
      imageUrl:
        giftIntent.giftSubmit.gifts[0].products[0].displayOptions[0].images[0]
          ?.secureUrl ||
        this.configService.get<string>('default.product.imageUrl'),
      formattedPrice: `$${giftIntent.giftSubmit.gifts[0].products[0].price}`, // TODO: verify the unit of measure + add symbols '.' , ','
      personalNote: giftIntent.giftSubmit.personalNote,
    };

    const shippingDetails: GiftShippingDetails = {
      ...getRecipientShippingDetails(giftIntent),
      shippingTimeInDays:
        giftIntent.giftSubmit?.gifts[0]?.products[0]?.shippingTimeInDays,
    };

    const data: GiftStatusUpdateMessageData = {
      ...getTheParticipatingParties(giftIntent),
      giftDetails,
      shippingDetails,
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
        ...this.getGiftOnItsWayMessageData(giftIntent),
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

    const shippingDetails: GiftShippingDetails = {
      ...getRecipientShippingDetails(giftIntent),
      shippingTimeInDays:
        giftIntent.giftSubmit?.gifts[0]?.products[0]?.shippingTimeInDays,
    };

    const payload: GiftDeliveredToSenderMessageData = {
      ...getTheParticipatingParties(giftIntent),
      giftDetails: {
        productName:
          giftIntent.giftSubmit?.gifts[0]?.products[0]?.displayOptions[0]?.name,
        imageUrl:
          giftIntent.giftSubmit?.gifts[0].products[0].displayOptions[0]
            .images[0]?.secureUrl ||
          this.configService.get<string>('default.product.imageUrl'),
        formattedPrice: `$${giftIntent.giftSubmit?.gifts[0].products[0].price}`,
        personalNote: giftIntent?.giftSubmit?.personalNote,
      },
      shippingDetails,
    };

    const sendResult = await this.customerIOService.sendEmail({
      template: EmailTemplate.SendSenderGiftDelivered.toString(),
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

  async sendRecipientTheGiftDelivered({
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

    const shippingDetails: GiftShippingDetails = {
      ...getRecipientShippingDetails(giftIntent),
      shippingTimeInDays:
        giftIntent.giftSubmit?.gifts[0]?.products[0]?.shippingTimeInDays,
    };

    const payload: GiftDeliveredToRecipientMessageData = {
      ...getTheParticipatingParties(giftIntent),
      giftDetails: {
        personalNote: giftIntent?.giftSubmit?.personalNote,
      },
      shippingDetails,
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
    if (this.isDevelopment) {
      return true;
    }
    const payload: ConnectionRequestExistingUserMessageData = {
      requestingUser: {
        firstName: requestingUser.profile.firstName,
      },
      receivingUser: {
        firstName: receivingUser.profile.firstName,
      },
      personalNote,
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

    return sendResult.status === EmailStatus.success;
  }

  async sendGroupInviteNewUser({
    email,
    inviterUser,
    group,
    code,
    groupMembers = [],
    expiresInDays,
  }: {
    email: string;
    inviterUser: User;
    group: Group;
    code: string;
    // Not implemented
    groupMembers?: GroupMember[];
    expiresInDays: number;
  }): Promise<boolean> {
    // Stub for local development
    if (this.isDevelopment) {
      return true;
    }

    const payload: GroupInviteNewUserMessageData = {
      code,
      inviterUser: {
        id: inviterUser.id,
        firstName: inviterUser.profile.firstName,
        lastName: inviterUser.profile.lastName,
      },
      group: {
        id: group.id,
        name: group.name,
        members: groupMembers.map((member) => {
          return {
            firstName: member.user.profile.firstName,
            lastName: member.user.profile.lastName,
            abbreviation: this.getAbbreviation(member.user.profile),
          };
        }),
      },
    };
    const sendResult = await this.customerIOService.sendEmail({
      template: EmailTemplate.SendGroupInviteNewUser.toString(),
      to: [email],
      emailTemplatePayload: {
        ...payload,
        transport: {
          origin: this.origin,
        },
      },
      identifier: { id: inviterUser.email },
    });

    return sendResult.status === EmailStatus.success;
  }

  async sendGroupInviteExistingUser({
    inviteeUser,
    inviterUser,
    group,
    code,
    // Not implemented
    groupMembers = [],
    expiresInDays,
  }: {
    inviteeUser: User;
    inviterUser: User;
    group: Group;
    code: string;
    groupMembers?: GroupMember[];
    expiresInDays: number;
  }): Promise<boolean> {
    // Stub for local development
    if (this.isDevelopment) {
      return true;
    }

    const payload: GroupInviteExistingUserMessageData = {
      code,
      inviteeUser: {
        firstName: inviteeUser.profile.firstName,
      },
      inviterUser: {
        id: inviterUser.id,
        firstName: inviterUser.profile.firstName,
        lastName: inviterUser.profile.lastName,
      },
      group: {
        id: group.id,
        name: group.name,
        members: groupMembers.map((member) => {
          return {
            firstName: member.user.profile.firstName,
            lastName: member.user.profile.lastName,
            abbreviation: this.getAbbreviation(member.user.profile),
          };
        }),
      },
    };

    const sendResult = await this.customerIOService.sendEmail({
      template: EmailTemplate.SendGroupInviteExistingUser.toString(),
      to: [inviteeUser.email],
      emailTemplatePayload: {
        ...payload,
        transport: {
          origin: this.origin,
        },
      },
      identifier: { id: inviterUser.email },
    });

    return sendResult.status === EmailStatus.success;
  }
}
