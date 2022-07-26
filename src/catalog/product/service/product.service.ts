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
import { CloudinaryService } from '$/cloudinary/service';
//
import { ConnectionNames } from '$/database';
import { IPaginationOptions } from '$/utils/pagination';
import { plainToInstance } from 'class-transformer';
import { IProductSearch } from '../product.interface';
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
    isActive,
    loadImages = true,
  }: IProductSearch): Promise<SelectQueryBuilder<Product>> {
    const builder = await this.productRepository
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
    const searchBuilder = await this.getSearchBuilder({
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
    const searchBuilder = await this.getSearchBuilder({
      language,
      search,
      keywords,
      isActive,
    });

    if (options.order) {
      if (options.order.keywords && keywords) {
        searchBuilder.orderBy(
          `CARDINALITY(ARRAY (
          SELECT UNNEST(display_options.keywords)
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
