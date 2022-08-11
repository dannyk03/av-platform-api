import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EnumVendorStatusCodeError } from '@avo/type';

import { plainToInstance } from 'class-transformer';
import { isNumber } from 'class-validator';
import {
  Brackets,
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';

import { Vendor } from '../entity';

import { CloudinaryService } from '@/cloudinary/service';

import { VendorGetSerialization } from '../serialization';

import { IVendorSearch, IVendorUpdate } from '../vendor.interface';

import { ConnectionNames } from '@/database';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(Vendor, ConnectionNames.Default)
    private readonly vendorRepository: Repository<Vendor>,
    private readonly cloudinaryService: CloudinaryService,
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

  async checkExistsBy(find: FindOptionsWhere<Vendor>) {
    const existsVendor = await this.vendorRepository.findOne({
      where: find,
      select: {
        id: true,
      },
    });

    return Boolean(existsVendor);
  }

  async deleteBy(find: FindOptionsWhere<Vendor>) {
    const deleteVendor = await this.vendorRepository.findOne({
      where: find,
      relations: ['logo'],
      select: {
        id: true,
        logo: {
          publicId: true,
        },
      },
    });

    if (!deleteVendor) {
      throw new UnprocessableEntityException({
        statusCode: EnumVendorStatusCodeError.VendorNotFoundError,
        message: 'vendor.error.notFound',
      });
    }

    if (deleteVendor?.logo) {
      await this.cloudinaryService.deleteResources({
        publicIds: [deleteVendor.logo.publicId],
      });
    }

    return this.vendorRepository.remove(deleteVendor);
  }

  async get({ id }: { id: string }): Promise<Vendor> {
    const getBuilder = this.vendorRepository
      .createQueryBuilder('vendor')
      .setParameters({ id })
      .where('vendor.id = :id')
      .leftJoinAndSelect('vendor.logo', 'logo');

    return getBuilder.getOne();
  }

  async update({ id, description, isActive }: IVendorUpdate): Promise<any> {
    const getVendor = await this.get({ id });

    getVendor.description = description;
    getVendor.isActive = isActive;

    return this.vendorRepository.save(getVendor);
  }

  async updateVendorActiveStatus({
    id,
    isActive,
  }: {
    id: string;
    isActive: boolean;
  }): Promise<UpdateResult> {
    return this.vendorRepository
      .createQueryBuilder()
      .update(Vendor)
      .set({ isActive })
      .where('id = :id', { id })
      .andWhere('isActive != :isActive', { isActive })
      .execute();
  }

  async getListSearchBuilder({
    search,
    isActive,
    loadLogos = true,
  }: IVendorSearch): Promise<SelectQueryBuilder<Vendor>> {
    const builder = this.vendorRepository
      .createQueryBuilder('vendor')
      .where('vendor.isActive = ANY(:isActive)', { isActive });

    if (loadLogos) {
      builder.leftJoinAndSelect('vendor.logo', 'logo');
    }

    if (search) {
      builder.andWhere(
        new Brackets((qb) => {
          builder.setParameters({ search, likeSearch: `%${search}%` });
          qb.where('vendor.name ILIKE :likeSearch').orWhere(
            'vendor.description ILIKE :likeSearch',
          );
        }),
      );
    }

    return builder;
  }

  async getTotal({ search, isActive }: IVendorSearch): Promise<number> {
    const searchBuilder = await this.getListSearchBuilder({
      loadLogos: false,
      search,
      isActive,
    });

    return searchBuilder.getCount();
  }

  async paginatedSearchBy({
    search,
    isActive,
    options,
  }: IVendorSearch): Promise<Vendor[]> {
    const searchBuilder = await this.getListSearchBuilder({
      search,
      isActive,
    });

    if (options.order) {
      searchBuilder.orderBy(options.order);
    }

    if (isNumber(options.take) && isNumber(options.skip)) {
      searchBuilder.take(options.take).skip(options.skip);
    }

    return searchBuilder.getMany();
  }

  async serialization(data: Vendor): Promise<VendorGetSerialization> {
    return plainToInstance(VendorGetSerialization, data);
  }

  async serializationList(data: Vendor[]): Promise<VendorGetSerialization[]> {
    return plainToInstance(VendorGetSerialization, data);
  }
}
