import { IVendorLogoGetSerialization } from '@avo/type';

import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class VendorLogoListSerialization
  implements IVendorLogoGetSerialization
{
  @Expose()
  readonly id: string;

  @Expose()
  readonly secureUrl: string;

  @Expose()
  readonly fileName: string;
}

export class VendorGetSerialization {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  @Type(() => VendorLogoListSerialization)
  logo: VendorLogoListSerialization;

  @Exclude()
  readonly deletedAt: Date;
}
