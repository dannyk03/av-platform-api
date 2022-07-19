import { Exclude } from 'class-transformer';
import { GiftSendRecipientDto } from '../dto';

export class SenderAdditionalDataSerialization {
  @Exclude()
  readonly recipients: GiftSendRecipientDto[];

  readonly email: string;

  readonly firstName: string;

  readonly lastName: string;
}

export class RecipientAdditionalDataSerialization {
  readonly email: string;

  readonly firstName: string;

  readonly lastName: string;
}
