import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EnumProductStatusCodeError } from '@avo/type';

import { plainToInstance } from 'class-transformer';
import { isNumber } from 'class-validator';
import flatMap from 'lodash/flatMap';
import {
  Brackets,
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  In,
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
    @InjectRepository(Product, ConnectionNames.Default)
    private readonly productRepository: Repository<Product>,
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

  async findAllByIds(ids?: string[]): Promise<Product[]> {
    return this.productRepository.find({ where: { id: In(ids) } });
  }

  async checkExistsBy(find: FindOptionsWhere<Product>) {
    const existsVendor = await this.productRepository.findOne({
      where: find,
      select: {
        id: true,
      },
    });

    return Boolean(existsVendor);
  }

  async get({ id, language }: IGetProduct): Promise<Product> {
    const getBuilder = this.productRepository
      .createQueryBuilder('product')
      .setParameters({ language, id })
      .where('product.id = :id')
      .leftJoinAndSelect('product.displayOptions', 'displayOptions')
      .leftJoinAndSelect('displayOptions.language', 'language')
      .leftJoinAndSelect('displayOptions.images', 'images')
      .andWhere('language.isoCode = :language');

    return getBuilder.getOne();
  }

  async getListSearchBuilder({
    search,
    keywords,
    language,
    isActive,
    priceRange,
    loadImages = true,
  }: IProductSearch): Promise<SelectQueryBuilder<Product>> {
    const builder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.vendor', 'vendor')
      .leftJoinAndSelect('product.displayOptions', 'displayOptions')
      .leftJoinAndSelect('displayOptions.language', 'language')
      .setParameters({ keywords, language })
      .where('language.isoCode = :language');

    if (isActive?.length) {
      builder.where('product.isActive = ANY(:isActive)', { isActive });
    }

    if (priceRange) {
      builder.andWhere('product.price BETWEEN :min AND :max', {
        min: priceRange[0],
        max: priceRange[1],
      });
    }

    if (loadImages) {
      builder.leftJoinAndSelect('displayOptions.images', 'images');
    }

    if (search) {
      builder.andWhere(
        new Brackets((qb) => {
          builder.setParameters({ search, likeSearch: `%${search}%` });
          qb.where('product.sku ILIKE :likeSearch')
            .orWhere('product.brand ILIKE :likeSearch')
            .orWhere('displayOptions.name ILIKE :likeSearch')
            .orWhere('displayOptions.description ILIKE :likeSearch');
        }),
      );
    }

    if (keywords) {
      builder.andWhere('displayOptions.keywords && :keywords');
    }

    return builder;
  }

  async getTotal({
    language,
    search,
    keywords,
    isActive,
    priceRange,
  }: IProductSearch): Promise<number> {
    const searchBuilder = await this.getListSearchBuilder({
      loadImages: false,
      language,
      search,
      keywords,
      isActive,
      priceRange,
    });

    return searchBuilder.getCount();
  }

  async paginatedSearchBy({
    language,
    search,
    keywords,
    options,
    isActive,
    priceRange,
  }: IProductSearch): Promise<Product[]> {
    const searchBuilder = await this.getListSearchBuilder({
      language,
      search,
      keywords,
      isActive,
      priceRange,
    });

    if (options.order) {
      if (options.order.keywords_special_logic && keywords) {
        searchBuilder
          .addSelect(
            'CARDINALITY(ARRAY(SELECT UNNEST(displayOptions.keywords) INTERSECT (SELECT UNNEST(ARRAY[:...keywords]))))',
            'keywords_cardinality',
          )
          .orderBy(
            'keywords_cardinality',
            options.order.keywords_special_logic,
          );
      } else if (!options.order.keywords_special_logic) {
        searchBuilder.orderBy(options.order);
      }
    }

    if (isNumber(options.take) && isNumber(options.skip)) {
      searchBuilder.take(options.take).skip(options.skip);
    }

    return searchBuilder.getMany();
  }

  async deleteProductBy({ id }: { id: string }): Promise<Product> {
    const removeProduct = await this.productRepository.findOne({
      where: { id },
      relations: ['displayOptions', 'displayOptions.images'],
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

    await this.cloudinaryService.deleteResources({ publicIds: imagePublicIds });
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

  async update({
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
