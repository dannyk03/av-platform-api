import { IProductImageGetSerialization } from '@avo/type';

import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ProductImageGetSerialization
  implements IProductImageGetSerialization
{
  @Expose()
  readonly id: string;

  @Expose()
  readonly weight: number;

  @Expose()
  readonly fileName: string;

  @Expose()
  readonly secureUrl: string;

  @Expose()
  readonly additionalData: object;
}
