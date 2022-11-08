import { IsUUID } from 'class-validator';

export class PaymentGetDto {
  @IsUUID()
  readonly giftOrderId: string;
}
