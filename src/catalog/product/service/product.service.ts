import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Brackets,
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
// Entities
import { Product } from '../entity';
// Services
import { CloudinaryService } from '@/cloudinary/service';
//
import { ConnectionNames } from '@/database';
import { IPaginationOptions } from '@/utils/pagination';
import { IProductSearch } from '../product.interface';
import { plainToInstance } from 'class-transformer';
import { ProductListSerialization } from '../serialization';

@Injectable()
export class ProductService {
  constructor(
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

  async getSearchBuilder({
    search,
    keywords,
    language,
    loadImages = true,
  }: IProductSearch): Promise<SelectQueryBuilder<Product>> {
    const builder = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.displayOptions', 'displayOptions')
      .leftJoinAndSelect('displayOptions.language', 'language')
      .setParameters({ keywords, language })
      .where('isActive = :isActive', { isActive: true })
      .where('language.isoCode = :language');

    if (loadImages) {
      builder.leftJoinAndSelect('displayOptions.images', 'images');
    }

    if (search) {
      builder.andWhere(
        new Brackets((qb) => {
          if (search) {
            builder.setParameters({ search, likeSearch: `%${search}%` });
            qb.where('sku ILIKE :likeSearch')
              .orWhere('brand ILIKE :likeSearch')
              .orWhere('displayOptions.name ILIKE :likeSearch')
              .orWhere('displayOptions.description ILIKE :likeSearch');
          }
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
  }: IProductSearch): Promise<number> {
    const searchBuilder = await this.getSearchBuilder({
      loadImages: false,
      language,
      search,
      keywords,
    });

    return searchBuilder.getCount();
  }

  async paginatedSearchBy({
    language,
    search,
    keywords,
    options,
  }: IProductSearch): Promise<Product[]> {
    const searchBuilder = await this.getSearchBuilder({
      language,
      search,
      keywords,
    });

    if (options.order) {
      if (options.order.keywords && keywords) {
        searchBuilder.orderBy(
          `CARDINALITY(ARRAY (
          SELECT UNNEST(displayOptions.keywords)
          INTERSECT
          SELECT UNNEST(array[:...keywords])))`,
          options.order.keywords,
        );
      } else {
        searchBuilder.orderBy(options.order);
      }
    }

    if (options.take && options.skip) {
      searchBuilder.take(options.take).skip(options.skip);
    }

    return searchBuilder.getMany();
  }

  async serializationList(
    data: Product[],
  ): Promise<ProductListSerialization[]> {
    return plainToInstance(ProductListSerialization, data);
  }
}
