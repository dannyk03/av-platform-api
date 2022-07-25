import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ProductImageListSerialization {
  @Expose()
  readonly id: string;

  @Expose()
  readonly fileName: string;

  @Expose()
  readonly secureUrl: string;

  @Expose()
  readonly additionalData: object;

  @Expose()
  readonly createdAt: Date;
}
