import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EnumProductStatusCodeError } from '@avo/type';

import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  In,
  Repository,
} from 'typeorm';
import { v5 as uuidv5 } from 'uuid';

import { ProductImage } from '../entity';

import { ProductDisplayOptionService } from '@/catalog/product-display-option/service';
import { CloudinaryService } from '@/cloudinary/service';

import { ConnectionNames } from '@/database/constant';

import { CloudinarySubject } from '@/cloudinary';

import { ICreateImages, ISaveImages } from '../product-image.interface';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectRepository(ProductImage, ConnectionNames.Default)
    private productImageRepository: Repository<ProductImage>,
    private readonly productDisplayOptionService: ProductDisplayOptionService,
    private cloudinaryService: CloudinaryService,
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
          return this.create({
            fileName: image.original_filename,
            assetId: image.asset_id,
            publicId: image.public_id,
            secureUrl: image.secure_url,
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
      subFolder: uuidv5(displayOption.product.sku, uuidv5.URL),
    });

    productImages.forEach(
      (image) => (image.productDisplayOption = displayOption),
    );

    return this.saveBulk(productImages);
  }
}
