import { SendEmailDto } from '../dto';

import { EmailInstance } from '../constant';

export interface EmailService {
  sendEmail(emailSendData: SendEmailDto): Promise<EmailInstance>;
}
