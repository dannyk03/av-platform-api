import { IsString } from 'class-validator';

export class PaymentCreateDto {
  @IsString()
  readonly orderId: string;
}
