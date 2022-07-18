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
import { EmailService } from '@/messaging/service/email';
import { HelperDateService, HelperHashService } from '@/utils/helper/service';
import { GiftService } from '../service';
import { UserService } from '@/user/service';
// Entities
import { User } from '@/user/entity';
//
import { GiftSendDto } from '../dto/gift.send.dto';
import { IResponse, Response } from '@/utils/response';
import { ReqUser } from '@/user';
import { EnumStatusCodeError } from '@/utils/error';
// import { GiftSendGuestDto } from '../dto';
import { GifSendGuard } from '../gift.decorator';
import { ConnectionNames } from '@/database';
import { ReqJwtUser } from '@/auth';

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
    private readonly helperHashService: HelperHashService,
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

          const res = await transactionalEntityManager.save(giftSends);

          console.log('aaa');

          res.forEach(async (giftSend) => {
            // const emailSent = await this.emailService.sendGiftEmailVerify({
            //   senderEmail: giftSend.sender.email,
            //   email: giftSend.recipientEmail,
            // });
            // if (emailSent) {
            //   giftSend.sentAt = this.helperDateService.create();
            // } else {
            //   throw new InternalServerErrorException({
            //     statusCode: EnumStatusCodeError.UnknownError,
            //     message: 'http.serverError.internalServerError',
            //   });
            // }
            //   this.giftService.save(giftSend);
          });
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

  // @Response('gift.send')
  // @HttpCode(HttpStatus.OK)
  // @Throttle(1, 5)
  // @Post('/guest/send')
  // async sendGuestGiftVerify(
  //   @Body()
  //   { email, recipients, firstName, lastName }: GiftSendGuestDto,
  // ): Promise<IResponse> {
  //   const uniqueRecipients = [...new Set(recipients)];
  //   const verifyCode = this.helperHashService.code32char();

  //   const giftSends = await Promise.all(
  //     uniqueRecipients.map(
  //       async (recipientEmail) =>
  //         await this.giftSendGuestService.create({
  //           senderEmail: email,
  //           senderFirstName: firstName,
  //           senderLastName: lastName,
  //           verifyCode,
  //           recipientEmail,
  //         }),
  //     ),
  //   );

  //   await this.giftSendGuestService.saveBulk(giftSends);

  //   const emailSent = await this.emailService.sendGiftSendEmailVerify({
  //     email: email,
  //     verifyCode,
  //   });

  //   if (!emailSent) {
  //     throw new InternalServerErrorException({
  //       statusCode: EnumStatusCodeError.UnknownError,
  //       message: 'http.serverError.internalServerError',
  //     });
  //   }

  //   return;
  // }
}
