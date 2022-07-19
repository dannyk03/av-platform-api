import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
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
}
