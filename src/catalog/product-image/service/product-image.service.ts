import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  EnumCloudinaryModeration,
  EnumProductStatusCodeError,
  EnumUploadFileMalwareDetectionStatus,
} from '@avo/type';

import {
  DeepPartial,
  DeleteResult,
  FindOneOptions,
  FindOptionsWhere,
  In,
  Repository,
  UpdateResult,
} from 'typeorm';

import { ProductImage } from '../entity';

import { ProductDisplayOptionService } from '@/catalog/product-display-option/service';
import { CloudinaryService } from '@/cloudinary/service';
import { HelperHashService } from '@/utils/helper/service';

import { ConnectionNames } from '@/database/constant';

import { CloudinarySubject } from '@/cloudinary';

import { ICreateImages, ISaveImages } from '../product-image.interface';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectRepository(ProductImage, ConnectionNames.Default)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly productDisplayOptionService: ProductDisplayOptionService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly helperHashService: HelperHashService,
  ) {}

  async create(props: DeepPartial<ProductImage>): Promise<ProductImage> {
    return this.productImageRepository.create(props);
  }

  async save(data: ProductImage): Promise<ProductImage> {
    return this.productImageRepository.save<ProductImage>(data);
  }

  async saveBulk(data: ProductImage[]): Promise<ProductImage[]> {
    return this.productImageRepository.save<ProductImage>(data);
  }

  async findOneBy(find: FindOptionsWhere<ProductImage>): Promise<ProductImage> {
    return this.productImageRepository.findOneBy(find);
  }
  async findOneByFileName(fileName: string): Promise<ProductImage> {
    return this.productImageRepository.findOneBy({
      fileName: fileName.toLowerCase(),
    });
  }

  async findOne(find: FindOneOptions<ProductImage>): Promise<ProductImage> {
    return this.productImageRepository.findOne(find);
  }

  async deleteById(id: string) {
    const deleteImage = await this.productImageRepository.findOneBy({ id });

    if (!deleteImage) {
      throw new UnprocessableEntityException({
        statusCode: EnumProductStatusCodeError.ProductImageNotFoundError,
        message: 'product.error.image',
      });
    }
    await this.cloudinaryService.deleteResources({
      publicIds: [deleteImage.publicId],
    });

    return this.productImageRepository.remove(deleteImage);
  }

  async deleteBulkById(ids: string[]) {
    const deleteImages = await this.productImageRepository.find({
      where: {
        id: In(ids),
      },
    });

    if (!deleteImages?.length) {
      throw new UnprocessableEntityException({
        statusCode: EnumProductStatusCodeError.ProductImageNotFoundError,
        message: 'product.error.image',
      });
    }
    await this.cloudinaryService.deleteResources({
      publicIds: deleteImages.map((image) => image?.publicId),
    });

    return this.productImageRepository.remove(deleteImages);
  }

  async createImages({
    images,
    language,
    subFolder,
  }: ICreateImages): Promise<ProductImage[]> {
    const uploadImages = await Promise.all(
      images.map(async (image) => {
        return this.cloudinaryService.uploadImage({
          subject: CloudinarySubject.Product,
          subFolder,
          image,
          languageIsoCode: language,
        });
      }),
    );

    return Promise.all(
      uploadImages.map(async (image) => {
        if (this.cloudinaryService.isUploadApiResponse(image)) {
          // Shitty cloudinary types
          const malwareDetectionStatus = (
            image.moderation.find(
              (mod: any) =>
                mod?.kind === EnumCloudinaryModeration.PerceptionPoint,
            ) as any
          )?.status;

          return this.create({
            fileName: image.original_filename,
            assetId: image.asset_id,
            publicId: image.public_id,
            secureUrl: image.secure_url,
            malwareDetectionStatus,
          });
        }

        return Promise.resolve(null);
      }),
    );
  }

  async saveImages({ id, images, language }: ISaveImages) {
    const displayOption =
      await this.productDisplayOptionService.findByProductIdAndLanguage({
        id,
        language,
      });

    const productImages = await this.createImages({
      images,
      language,
      subFolder: await this.helperHashService.uuidV5(displayOption.product.sku),
    });

    productImages.forEach(
      (image) => (image.productDisplayOption = displayOption),
    );

    return this.saveBulk(productImages);
  }

  async updateImageMalwareDetectionStatus({
    assetId,
    malwareDetectionStatus,
  }: {
    assetId: string;
    malwareDetectionStatus: EnumUploadFileMalwareDetectionStatus;
  }): Promise<UpdateResult> {
    return this.productImageRepository
      .createQueryBuilder()
      .update(ProductImage)
      .set({ malwareDetectionStatus })
      .where('assetId = :assetId', { assetId })
      .execute();
  }

  async removeByAssetId({
    assetId,
  }: {
    assetId: string;
  }): Promise<DeleteResult> {
    return this.productImageRepository.delete({ assetId });
  }
}
