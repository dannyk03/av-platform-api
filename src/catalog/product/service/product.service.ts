import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Brackets,
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
// Entities
import { Product } from '../entity';
// Services
import { CloudinaryService } from '@/cloudinary/service';
//
import { ConnectionNames } from '@/database';
import { IPaginationOptions } from '@/utils/pagination';
import { EnumDisplayLanguage } from '@/language/display-language';

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

  async searchBy({
    language,
    search,
    keywords,
    options,
  }: {
    language: EnumDisplayLanguage;
    search?: string;
    keywords?: string[];
    options?: IPaginationOptions;
  }): Promise<Product[]> {
    const builder = await this.productRepository
      .createQueryBuilder('product')
      .setParameters({ keywords })
      .setParameter('keywords', keywords)
      .leftJoinAndSelect('product.displayOptions', 'display_options')
      .leftJoinAndSelect('display_options.images', 'images')
      .leftJoinAndSelect('display_options.language', 'language')
      .where('language.isoCode = :language', { language });

    if (search) {
      builder.andWhere(
        new Brackets((qb) => {
          if (search) {
            builder.setParameters({ search, likeSearch: `%${search}%` });
            qb.where('sku ILIKE :likeSearch')
              .orWhere('brand ILIKE :likeSearch')
              .orWhere('display_options.name ILIKE :likeSearch')
              .orWhere('display_options.description ILIKE :likeSearch');
          }
        }),
      );
    }

    if (keywords) {
      builder.andWhere('display_options.keywords && :keywords', {
        keywords,
      });
    }

    if (options.order) {
      if (options.order.keywords && keywords) {
        builder.orderBy(
          `CARDINALITY(ARRAY (
          SELECT UNNEST(display_options.keywords)
          INTERSECT
          SELECT UNNEST(array[:...keywords])))`,
          options.order.keywords,
        );
      } else {
        builder.orderBy(options.order);
      }
    }

    if (options.take && options.skip) {
      builder.take(options.take).skip(options.skip);
    }

    return builder.getMany();
  }
}
