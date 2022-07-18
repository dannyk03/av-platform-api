import { Exclude } from 'class-transformer';
import { GiftSendRecipientDto } from '../dto';

export class SenderAdditionalDataSerialization {
  @Exclude()
  readonly email: string;

  @Exclude()
  readonly recipients: GiftSendRecipientDto[];

  readonly firstName: string;

  readonly lastName: string;
}

export class RecipientAdditionalDataSerialization {
  @Exclude()
  readonly email: string;

  readonly firstName: string;

  readonly lastName: string;
}
