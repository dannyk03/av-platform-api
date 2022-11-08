import { IsUUID } from 'class-validator';

export class PaymentCreateDto {
  @IsUUID()
  readonly giftOrderId: string;
}
