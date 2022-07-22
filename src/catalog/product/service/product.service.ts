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
import {
  EnumPaginationAvailableSortType,
  IPaginationOptions,
} from '@/utils/pagination';
import { EnumDisplayLanguage } from '@/language/display-language';
import { ProductNestingAliasMap } from '../product.constant';

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
      .createQueryBuilder()
      .leftJoinAndSelect('Product.displayOptions', 'displayOptions')
      .leftJoinAndSelect('displayOptions.language', 'language')
      .where('language.isoCode = :language', { language })
      .andWhere(
        new Brackets((qb) => {
          if (search) {
            const likeSearch = `%${search}%`;
            qb.where('sku ILIKE :likeSearch', { likeSearch })
              .orWhere('brand ILIKE :likeSearch', {
                likeSearch,
              })
              .orWhere('displayOptions.name ILIKE :likeSearch', {
                likeSearch,
              })
              .orWhere('displayOptions.description ILIKE :likeSearch', {
                likeSearch,
              });
          }
        }),
      );

    if (keywords) {
      builder.andWhere('displayOptions.keywords && :keywords', {
        keywords,
      });
    }

    if (options.take && options.skip) {
      builder.take(options.take).skip(options.skip);
    }

    if (options.order) {
      builder.orderBy(options.order);

      // if (options.order.keywordsCardinality && keywords) {
      //   builder.orderBy(
      //     `CARDINALITY(ARRAY[keywords] & ARRAY[${keywords}])`,
      //     'DESC',
      //   );
      // builder
      //   .from('')
      //   .select(
      //     `CARDINALITY(ARRAY[displayOptions.keywords] & ARRAY[${keywords}])`,
      //     ProductNestingAliasMap.keywords,
      //   );
      // }
    }

    const aaa = builder.getQuery();
    const bbb = await builder.getMany();

    return bbb;
  }
}
