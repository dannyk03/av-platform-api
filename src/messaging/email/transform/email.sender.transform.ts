import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class EmailPayloadSender {
  @Expose()
  id: number;

  @Expose()
  email: string;

  password: string;
}
