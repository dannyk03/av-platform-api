import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
// Services
import { DebuggerService } from '@/debugger/service';
import { EmailService } from '@/messaging/service/email';
import { HelperDateService, HelperHashService } from '@/utils/helper/service';
import { GiftSendGuestService, GiftSendService } from '../service';
// Entities
import { User } from '@/user/entity';
//
import { AclGuard } from '@/auth';
import { GiftSendDto } from '../dto/gift.send.dto';
import { IResponse, Response } from '@/utils/response';
import { ReqUser } from '@/user';
import { EnumStatusCodeError } from '@/utils/error';
import { GiftSendGuestDto } from '../dto';

@Controller({
  version: '1',
})
export class GiftController {
  constructor(
    private readonly debuggerService: DebuggerService,
    private readonly configService: ConfigService,
    private readonly helperDateService: HelperDateService,
    private readonly emailService: EmailService,
    private readonly giftSendService: GiftSendService,
    private readonly giftSendGuestService: GiftSendGuestService,
    private readonly helperHashService: HelperHashService,
  ) {}

  @Response('gift.send')
  @HttpCode(HttpStatus.OK)
  @AclGuard()
  @Throttle(1, 5)
  @Post('/send')
  async sendGiftSurvey(
    @Body()
    { recipients }: GiftSendDto,
    @ReqUser()
    reqUser: User,
  ): Promise<IResponse> {
    const uniqueRecipients = [...new Set(recipients)];

    const giftSends = await Promise.all(
      uniqueRecipients.map(
        async (email) =>
          await this.giftSendService.create({
            sender: reqUser,
            recipientEmail: email,
          }),
      ),
    );

    const res = await this.giftSendService.saveBulk(giftSends);

    res.forEach(async (giftSend) => {
      const emailSent = await this.emailService.sendGiftSurvey({
        senderEmail: giftSend.sender.email,
        email: giftSend.recipientEmail,
      });

      if (emailSent) {
        giftSend.sentAt = this.helperDateService.create();
      } else {
        throw new InternalServerErrorException({
          statusCode: EnumStatusCodeError.UnknownError,
          message: 'http.serverError.internalServerError',
        });
      }

      this.giftSendService.save(giftSend);
    });

    return;
  }

  @Response('gift.send')
  @HttpCode(HttpStatus.OK)
  @Throttle(1, 5)
  @Post('/guest/send')
  async sendGuestGiftVerify(
    @Body()
    { email, recipients, firstName, lastName }: GiftSendGuestDto,
  ): Promise<IResponse> {
    const uniqueRecipients = [...new Set(recipients)];
    const verifyCode = this.helperHashService.code32char();

    const giftSends = await Promise.all(
      uniqueRecipients.map(
        async (recipientEmail) =>
          await this.giftSendGuestService.create({
            senderEmail: email,
            senderFirstName: firstName,
            senderLastName: lastName,
            verifyCode,
            recipientEmail,
          }),
      ),
    );

    await this.giftSendGuestService.saveBulk(giftSends);

    const emailSent = await this.emailService.sendGiftSendEmailVerify({
      email: email,
      verifyCode,
    });

    if (!emailSent) {
      throw new InternalServerErrorException({
        statusCode: EnumStatusCodeError.UnknownError,
        message: 'http.serverError.internalServerError',
      });
    }

    return;
  }
}
