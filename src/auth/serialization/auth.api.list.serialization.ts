import { Type } from 'class-transformer';

export class AuthApiListSerialization {
  @Type(() => String)
  readonly id: string;

  readonly name: string;
  readonly key: string;
  readonly isActive: boolean;
  readonly createdAt: Date;
}
