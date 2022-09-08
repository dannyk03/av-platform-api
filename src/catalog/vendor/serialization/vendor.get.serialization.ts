import { IVendorLogoGetSerialization } from '@avo/type';

import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class VendorLogoGetSerialization implements IVendorLogoGetSerialization {
  @Expose()
  readonly id: string;

  @Expose()
  readonly secureUrl: string;

  @Expose()
  readonly fileName: string;
}

@Exclude()
export class VendorGetSerialization {
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;

  @Expose()
  readonly description: string;

  @Expose()
  readonly isActive: boolean;

  @Expose()
  readonly createdAt: Date;

  @Expose()
  readonly updatedAt: Date;

  @Expose()
  @Type(() => VendorLogoGetSerialization)
  logo: VendorLogoGetSerialization;
}
