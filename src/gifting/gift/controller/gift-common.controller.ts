import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// Services
import { DebuggerService } from '@/debugger/service/debugger.service';
import { EmailService } from '@/messaging/service/email/email.service';
import { GiftSendService } from '../service/gift-send.service';
import { HelperDateService } from '@/utils/helper/service';
// Entities
import { User } from '@/user/entity/user.entity';
//
import { AclGuard } from '@/auth';
import { GiftSendDto } from '../dto/gift.send.dto';
import { Response } from '@/utils/response';
import { ReqUser } from '@/user';

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
  ) {}

  @Response('gift.send')
  @HttpCode(HttpStatus.OK)
  @AclGuard()
  @Post('/send')
  async sendGiftSurvey(
    @Body()
    { email }: GiftSendDto,
    @ReqUser()
    reqUser: User,
  ) {
    const emails = [...new Set(email)];

    const giftSends = await Promise.all(
      emails.map(
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
      }

      this.giftSendService.save(giftSend);
    });
  }
}
