import { SendEmailDto } from '@/messaging/email/dto';
import {
  CustomerIOTransactionalResponse,
  EmailInstance,
  EmailStatus,
} from '@/messaging/email/email.constant';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APIClient, SendEmailRequest } from 'customerio-node';
import { firstValueFrom } from 'rxjs';
import { EnumCustomerIoStatusCodeError } from '../customer-io.constant';

@Injectable()
export class CustomerIOService {
  private readonly client: APIClient;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.client = new APIClient(
      this.configService.get<string>('customer-io.apiKey'),
    );
  }
  async sendEmail(emailSendData: SendEmailDto): Promise<EmailInstance> {
    const { to, identifier, template, emailTemplatePayload } = emailSendData;
    const transactionalMessageId = await this.getTransactionalMessageId(
      template,
    );
    const request = new SendEmailRequest({
      to: to.join(),
      transactional_message_id: transactionalMessageId,
      identifiers: identifier,
      message_data: emailTemplatePayload,
    });

    try {
      const sendResponse = await this.client.sendEmail(request);
      return this.getEmailInstance(sendResponse);
    } catch (error) {
      // TODO: replace with loggerService
      console.log(
        `An error occur in CustomerIOService.sendEmail`,
        error,
        emailSendData,
      );
      return this.getEmailInstance();
    }
  }

  getEmailInstance(sendResult?: Record<string, any>): EmailInstance {
    if (!sendResult) {
      return {
        id: null,
        status: EmailStatus.failure,
        response: null,
      };
    }
    return {
      id: sendResult.delivery_id,
      status: EmailStatus.success,
      response: sendResult.queued_at,
    };
  }

  getTransactionalMessageId = async (name: string): Promise<string> => {
    const url = this.configService.get<string>('customer-io.url');
    const { data } = await firstValueFrom(
      this.httpService.get<CustomerIOTransactionalResponse>(url, {
        headers: {
          Authorization: `Bearer ${this.configService.get<string>(
            'customer-io.apiKey',
          )}`,
        },
      }),
    );

    const message = data.messages.find((m) => m.name === name);

    if (!message) {
      throw new BadRequestException({
        statusCode:
          EnumCustomerIoStatusCodeError.CustomerIoTransactionalMessageError,
        message: `Transactional message ${name} doesn't exist on customer.io`,
      });
    }
    return message.id;
  };
}
