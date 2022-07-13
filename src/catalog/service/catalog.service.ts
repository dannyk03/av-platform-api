import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
// Entities
import { Product } from '../entity/product.entity';
// Services
import { DebuggerService } from '@/debugger/service';
//
import { ConnectionNames } from '@/database';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Product, ConnectionNames.Default)
    private productRepository: Repository<Product>,
    private readonly configService: ConfigService,
    private readonly debuggerService: DebuggerService,
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
}
