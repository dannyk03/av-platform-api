import {
  EnumUploadFileMalwareDetectionStatus,
  IProductImageGetSerialization,
} from '@avo/type';

import { Exclude, Expose, Transform } from 'class-transformer';

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
  @Transform(({ obj }) => {
    return [
      EnumUploadFileMalwareDetectionStatus.Pending,
      EnumUploadFileMalwareDetectionStatus.Rejected,
    ].includes(obj.malwareDetectionStatus)
      ? null
      : obj.secureUrl;
  })
  readonly secureUrl: string;

  @Expose()
  readonly additionalData: object;

  @Expose()
  readonly malwareDetectionStatus: EnumUploadFileMalwareDetectionStatus;
}
