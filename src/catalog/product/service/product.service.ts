import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import { EnumProductStatusCodeError } from '@avo/type';

import { plainToInstance } from 'class-transformer';
import { isNumber } from 'class-validator';
import flatMap from 'lodash/flatMap';
import {
  Brackets,
  DataSource,
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';

import { Product } from '../entity';

import { CloudinaryService } from '@/cloudinary/service';

import { ProductListSerialization } from '../serialization';

import {
  IGetProduct,
  IProductSearch,
  IProductUpdate,
} from '../product.interface';

import { ConnectionNames } from '@/database';
import { IPaginationOptions } from '@/utils/pagination';

@Injectable()
export class ProductService {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    @InjectRepository(Product, ConnectionNames.Default)
    private productRepository: Repository<Product>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(props: DeepPartial<Product>): Promise<Product> {
    return this.productRepository.create(props);
  }

  async save(data: Product): Promise<Product> {
    return this.productRepository.save<Product>(data);
  }

  async findOneBy(find: FindOptionsWhere<Product>): Promise<Product> {
    return this.productRepository.findOneBy(find);
  }

  async findOne(find: FindOneOptions<Product>): Promise<Product> {
    return this.productRepository.findOne(find);
  }

  async findAll(
    find?: Record<string, any>,
    options?: IPaginationOptions,
  ): Promise<Product[]> {
    return this.productRepository.find({ where: find, ...options });
  }

  async get({ id, language }: IGetProduct): Promise<Product> {
    const getBuilder = this.productRepository
      .createQueryBuilder('product')
      .setParameters({ language, id })
      .where('product.id = :id')
      .leftJoinAndSelect('product.display_options', 'display_options')
      .leftJoinAndSelect('display_options.language', 'language')
      .leftJoinAndSelect('display_options.images', 'images')
      .andWhere('language.isoCode = :language');

    return getBuilder.getOne();
  }

  async getListSearchBuilder({
    search,
    keywords,
    language,
    isActive,
    loadImages = true,
  }: IProductSearch): Promise<SelectQueryBuilder<Product>> {
    const builder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.displayOptions', 'display_options')
      .leftJoinAndSelect('display_options.language', 'language')
      .setParameters({ keywords, language })
      .where('product.isActive = ANY(:isActive)', { isActive })
      .andWhere('language.isoCode = :language');

    if (loadImages) {
      builder.leftJoinAndSelect('display_options.images', 'images');
    }

    if (search) {
      builder.andWhere(
        new Brackets((qb) => {
          builder.setParameters({ search, likeSearch: `%${search}%` });
          qb.where('sku ILIKE :likeSearch')
            .orWhere('brand ILIKE :likeSearch')
            .orWhere('display_options.name ILIKE :likeSearch')
            .orWhere('display_options.description ILIKE :likeSearch');
        }),
      );
    }

    if (keywords) {
      builder.andWhere('display_options.keywords && :keywords');
    }

    return builder;
  }

  async getTotal({
    language,
    search,
    keywords,
    isActive,
  }: IProductSearch): Promise<number> {
    const searchBuilder = await this.getListSearchBuilder({
      loadImages: false,
      language,
      search,
      keywords,
      isActive,
    });

    return searchBuilder.getCount();
  }

  async paginatedSearchBy({
    language,
    search,
    keywords,
    options,
    isActive,
  }: IProductSearch): Promise<Product[]> {
    const searchBuilder = await this.getListSearchBuilder({
      language,
      search,
      keywords,
      isActive,
    });

    if (options.order) {
      if (options.order.keywords && keywords) {
        searchBuilder
          .addSelect(
            'CARDINALITY(ARRAY(SELECT UNNEST(display_options.keywords) INTERSECT (SELECT UNNEST(ARRAY[:...keywords]))))',
            'keywords_cardinality',
          )
          .orderBy('keywords_cardinality', options.order.keywords);
      } else {
        searchBuilder.orderBy(options.order);
      }
    }

    if (isNumber(options.take) && isNumber(options.skip)) {
      searchBuilder.take(options.take).skip(options.skip);
    }

    console.log(searchBuilder.getQueryAndParameters());

    const xxx = await searchBuilder.getMany();
    return searchBuilder.getMany();
  }

  async deleteProductBy({ id }: { id: string }): Promise<Product> {
    const removeProduct = await this.productRepository.findOne({
      where: { id },
      relations: ['display_options', 'display_options.images'],
    });

    if (!removeProduct) {
      throw new UnprocessableEntityException({
        statusCode: EnumProductStatusCodeError.ProductNotFoundError,
        message: 'product.error.notFound',
      });
    }

    const imagePublicIds = flatMap(removeProduct.displayOptions, ({ images }) =>
      flatMap(images, ({ publicId }) => publicId),
    );

    await this.cloudinaryService.deleteImages({ publicIds: imagePublicIds });
    return this.productRepository.remove(removeProduct);
  }

  async updateProductActiveStatus({
    id,
    isActive,
  }: {
    id: string;
    isActive: boolean;
  }): Promise<UpdateResult> {
    return this.productRepository
      .createQueryBuilder()
      .update(Product)
      .set({ isActive })
      .where('id = :id', { id })
      .andWhere('isActive != :isActive', { isActive })
      .execute();
  }

  async updateProduct({
    id,
    sku,
    brand,
    isActive,
    display: { language, ...restDisplay },
  }: IProductUpdate): Promise<any> {
    const getProduct = await this.get({ id, language: language });

    getProduct.sku = sku;
    getProduct.brand = brand;
    getProduct.isActive = isActive;

    getProduct.displayOptions[0] = {
      ...getProduct.displayOptions[0],
      ...restDisplay,
    };

    return this.productRepository.save(getProduct);
  }

  async serialization(data: Product): Promise<ProductListSerialization> {
    return plainToInstance(ProductListSerialization, data);
  }

  async serializationList(
    data: Product[],
  ): Promise<ProductListSerialization[]> {
    return plainToInstance(ProductListSerialization, data);
  }
}
