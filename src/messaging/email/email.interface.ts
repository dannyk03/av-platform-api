import { SendEmailDto } from './dto';

import { EmailInstance } from './email.constant';

export interface EmailService {
  sendEmail(emailSendData: SendEmailDto): Promise<EmailInstance>;
}
