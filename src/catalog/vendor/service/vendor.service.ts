import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import { EnumVendorStatusCodeError } from '@avo/type';

import {
  DataSource,
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { Vendor } from '../entity';

import { VendorLogoService } from './vendor-logo.service';

import { ConnectionNames } from '@/database';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(Vendor, ConnectionNames.Default)
    private readonly vendorRepository: Repository<Vendor>,
    private readonly vendorLogoService: VendorLogoService,
  ) {}

  async create(props: DeepPartial<Omit<Vendor, 'slug'>>): Promise<Vendor> {
    return this.vendorRepository.create(props);
  }

  async save(data: Vendor): Promise<Vendor> {
    return this.vendorRepository.save<Vendor>(data);
  }

  async saveBulk(data: Vendor[]): Promise<Vendor[]> {
    return this.vendorRepository.save<Vendor>(data);
  }

  async findOneBy(find: FindOptionsWhere<Vendor>): Promise<Vendor> {
    return this.vendorRepository.findOneBy(find);
  }

  async findOne(find: FindOneOptions<Vendor>): Promise<Vendor> {
    return this.vendorRepository.findOne(find);
  }

  async deleteById(id: string) {
    const deleteVendor = await this.vendorRepository.findOneBy({ id });

    if (!deleteVendor) {
      throw new UnprocessableEntityException({
        statusCode: EnumVendorStatusCodeError.VendorNotFoundError,
        message: 'product.error.image',
      });
    }

    return this.vendorRepository.remove(deleteVendor);
  }
}
