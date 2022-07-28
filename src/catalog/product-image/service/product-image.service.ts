import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { ProductImage } from '../entity';

import { CloudinaryService } from '@/cloudinary/service';

import { UploadCloudinaryImage } from '@/cloudinary';
import { ConnectionNames } from '@/database';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectRepository(ProductImage, ConnectionNames.Default)
    private productImageRepository: Repository<ProductImage>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(props: DeepPartial<ProductImage>): Promise<ProductImage> {
    return this.productImageRepository.create(props);
  }

  async save(data: ProductImage): Promise<ProductImage> {
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
}
