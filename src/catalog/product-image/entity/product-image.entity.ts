import { AfterLoad, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { ProductDisplayOption } from '@/catalog/product-display-option/entity';
import { BaseEntity } from '@/database/entity';

import { EnumUploadFileMalwareDetectionStatus } from '@/cloudinary/constant';

@Entity()
export class ProductImage extends BaseEntity<ProductImage> {
  @Column({
    length: 30,
  })
  fileName!: string;

  @Column({
    unique: true,
    length: 32,
    update: false,
  })
  assetId!: string;

  @Column({
    unique: true,
    length: 100,
  })
  publicId!: string;

  @Column({
    unique: true,
    length: 200,
  })
  secureUrl!: string;

  @Column({
    type: 'int2',
    default: 0,
  })
  weight: number;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  additionalData?: object;

  @ManyToOne(
    () => ProductDisplayOption,
    (displayOption) => displayOption.images,
    { onDelete: 'CASCADE', orphanedRowAction: 'delete' },
  )
  @JoinColumn()
  productDisplayOption: ProductDisplayOption;

  @Column({
    type: 'enum',
    enum: EnumUploadFileMalwareDetectionStatus,
    default: EnumUploadFileMalwareDetectionStatus.Pending,
  })
  malwareDetectionStatus: EnumUploadFileMalwareDetectionStatus;

  @AfterLoad()
  substituteImageUrlsIfNotScannedForMalwareDetection() {
    if (
      this.malwareDetectionStatus !==
      EnumUploadFileMalwareDetectionStatus.Approved
    ) {
      this.secureUrl = undefined;
    }
  }
}
