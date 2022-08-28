import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { Currency } from '../entity';

import { ConnectionNames } from '@/database/constant';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(Currency, ConnectionNames.Default)
    private currencyRepository: Repository<Currency>,
  ) {}

  async create(
    props: DeepPartial<Omit<Currency, 'isoName'>>,
  ): Promise<Currency> {
    return this.currencyRepository.create(props);
  }

  async save(data: Currency): Promise<Currency> {
    return this.currencyRepository.save<Currency>(data);
  }

  async findOneBy(find: FindOptionsWhere<Currency>): Promise<Currency> {
    return this.currencyRepository.findOneBy(find);
  }

  async findOne(find: FindOneOptions<Currency>): Promise<Currency> {
    return this.currencyRepository.findOne(find);
  }
}
