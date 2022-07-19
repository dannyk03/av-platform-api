import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import { DataSource } from 'typeorm';
// Services
import { DebuggerService } from '@/debugger/service';
import { EmailService } from '@/messaging/email';
import { HelperDateService } from '@/utils/helper/service';
import { GiftSendConfirmationLinkService, GiftService } from '../service';
import { UserService } from '@/user/service';
// Entities
import { User } from '@/user/entity';
//
import { GiftSendDto } from '../dto/gift.send.dto';
import { IResponse, Response } from '@/utils/response';
import { ReqUser } from '@/user';
import { EnumStatusCodeError } from '@/utils/error';
import { GifSendGuard } from '../gift.decorator';
import { ConnectionNames } from '@/database';
import { ReqJwtUser } from '@/auth';
import { EnumMessagingStatusCodeError } from '@/messaging';

@Controller({
  version: '1',
})
export class GiftController {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    private readonly debuggerService: DebuggerService,
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
    giftSend: GiftSendDto,
    @ReqJwtUser()
    reqJwtUser: User,
  ): Promise<IResponse> {
    const uniqueRecipients = [...new Set(giftSend.recipients)];

    const maybeSenderUser = await this.userService.findOneBy({
      email: reqJwtUser?.email || giftSend.email,
    });

    try {
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
                      giftSend,
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
              });
            }),
          );

          const confirmationLink =
            await this.giftSendConfirmationLinkService.create({
              gifts: giftSends,
            });

          await transactionalEntityManager.save(confirmationLink);

          const updatedGiftSends = await Promise.all(
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
              return transactionalEntityManager.save(giftSend);
            }),
          );

          console.log(updatedGiftSends);
        },
      );
    } catch (error) {
      this.debuggerService.error(
        'Internal Error',
        'GiftController',
        'send',
        error,
      );
      throw new InternalServerErrorException({
        statusCode: EnumStatusCodeError.UnknownError,
        message: 'http.serverError.internalServerError',
      });
    }

    return;
  }
}
