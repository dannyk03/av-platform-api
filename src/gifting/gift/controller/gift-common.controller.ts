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
import { InjectDataSource } from '@nestjs/typeorm';

import { DataSource } from 'typeorm';

import { ReqJwtUser } from '@/auth';
import { ConnectionNames } from '@/database';
import { EnumMessagingStatusCodeError } from '@/messaging';
import { EmailService } from '@/messaging/email';
import { User } from '@/user/entity';
import { UserService } from '@/user/service';
import { HelperDateService } from '@/utils/helper/service';
import { IResponse, Response } from '@/utils/response';

import { GiftSendDto } from '../dto/gift.send.dto';
import { GifSendGuard } from '../gift.decorator';
import { GiftSendConfirmationLinkService, GiftService } from '../service';

@Controller({
  version: '1',
})
export class GiftController {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    private readonly configService: ConfigService,
    private readonly helperDateService: HelperDateService,
    private readonly emailService: EmailService,
    private readonly giftService: GiftService,
    private readonly userService: UserService,
    private readonly giftSendConfirmationLinkService: GiftSendConfirmationLinkService,
  ) {}

  @Response('gift.send')
  @HttpCode(HttpStatus.OK)
  @GifSendGuard()
  @Throttle(1, 5)
  @Post('/send')
  async sendGiftSurvey(
    @Body()
    { sender, recipients, additionalData }: GiftSendDto,
    @ReqJwtUser()
    reqJwtUser: User,
  ): Promise<IResponse> {
    const uniqueRecipients = [...new Set(recipients)];

    const maybeSenderUser = await this.userService.findOneBy({
      email: reqJwtUser?.email || sender.email,
    });

    await this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        const giftSends = await Promise.all(
          uniqueRecipients.map(async (recipient) => {
            const maybeRecipientUser = await this.userService.findOneBy({
              email: recipient.email,
            });

            return this.giftService.create({
              sender: {
                user: maybeSenderUser,
                additionalData: {
                  ...(await this.giftService.serializationSenderGiftAdditionalData(
                    sender,
                  )),
                },
              },
              recipient: {
                user: maybeRecipientUser,
                additionalData: {
                  ...(await this.giftService.serializationRecipientGiftAdditionalData(
                    recipient,
                  )),
                },
              },
              additionalData: {
                occasion: additionalData.occasion,
                priceMin: additionalData.minPrice,
                priceMax: additionalData.maxPrice,
                currency: { code: additionalData.currency },
              },
            });
          }),
        );

        const confirmationLink =
          await this.giftSendConfirmationLinkService.create({
            gifts: giftSends,
          });

        await transactionalEntityManager.save(confirmationLink);

        await Promise.all(
          giftSends.map(async (giftSend) => {
            const emailSent = await this.emailService.sendGiftConfirm({
              email: giftSend.sender.user?.email,
              code: confirmationLink.code,
            });
            if (!emailSent) {
              throw new InternalServerErrorException({
                statusCode:
                  EnumMessagingStatusCodeError.MessagingEmailSendError,
                message: 'http.serverError.internalServerError',
              });
            }
            giftSend.confirmationLink = confirmationLink;
            return transactionalEntityManager.save(giftSend);
          }),
        );
      },
    );

    return;
  }
}
