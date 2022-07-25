import { Injectable } from '@nestjs/common';
import { APIClient, SendEmailRequest } from 'customerio-node';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import {
  EmailInstance,
  EmailStatus,
  CustomerIOTransactionalResponse,
  SendEmailDto,
} from './types';

@Injectable()
export class CustomerIOService {
  private readonly client: APIClient;

  constructor(private readonly httpService: HttpService) {
    this.client = new APIClient(process.env.CUSTOMER_IO_API_KEY);
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
    const url = `https://api.customer.io/v1/transactional`;
    const { data } = await firstValueFrom(
      this.httpService.get<CustomerIOTransactionalResponse>(url, {
        headers: {
          Authorization: `Bearer ${process.env.CUSTOMER_IO_API_KEY}`,
        },
      }),
    );

    const message = data.messages.find((m) => m.name === name);

    if (!message) {
      throw new Error(
        `Transactional message ${name} doesn't exist on customer.io`,
      );
    }
    return message.id;
  };
}
