import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { ProductDisplayOption } from '../entity';

import { ConnectionNames } from '@/database';
import { EnumDisplayLanguage } from '@/language/display-language';

@Injectable()
export class ProductDisplayOptionService {
  constructor(
    @InjectRepository(ProductDisplayOption, ConnectionNames.Default)
    private productDisplayOptionRepository: Repository<ProductDisplayOption>,
  ) {}

  async create(
    props: DeepPartial<ProductDisplayOption>,
  ): Promise<ProductDisplayOption> {
    return this.productDisplayOptionRepository.create(props);
  }

  async save(data: ProductDisplayOption): Promise<ProductDisplayOption> {
    return this.productDisplayOptionRepository.save<ProductDisplayOption>(data);
  }

  async findOneBy(
    find: FindOptionsWhere<ProductDisplayOption>,
  ): Promise<ProductDisplayOption> {
    return this.productDisplayOptionRepository.findOneBy(find);
  }

  async findOne(
    find: FindOneOptions<ProductDisplayOption>,
  ): Promise<ProductDisplayOption> {
    return this.productDisplayOptionRepository.findOne(find);
  }

  async findByProductIdAndLanguage({
    id,
    language,
  }: {
    id: string;
    language: EnumDisplayLanguage;
  }) {
    return this.productDisplayOptionRepository
      .createQueryBuilder('display')
      .leftJoinAndSelect('display.product', 'product')
      .leftJoinAndSelect('display.language', 'language')
      .setParameters({ id, language })
      .where('product.id = :id')
      .andWhere('language.isoCode = :language')
      .getOne();
  }
}
