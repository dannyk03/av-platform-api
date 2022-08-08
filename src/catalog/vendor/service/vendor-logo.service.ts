import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EnumVendorStatusCodeError } from '@avo/type';

import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { VendorLogo } from '../entity';

import { CloudinaryService } from '@/cloudinary/service';

import { ICreateLogo } from '../vendor.interface';

import { CloudinarySubject } from '@/cloudinary';
import { ConnectionNames } from '@/database';

@Injectable()
export class VendorLogoService {
  constructor(
    @InjectRepository(VendorLogo, ConnectionNames.Default)
    private vendorLogoRepository: Repository<VendorLogo>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(props: DeepPartial<VendorLogo>): Promise<VendorLogo> {
    return this.vendorLogoRepository.create(props);
  }

  async save(data: VendorLogo): Promise<VendorLogo> {
    return this.vendorLogoRepository.save<VendorLogo>(data);
  }

  async findOneBy(find: FindOptionsWhere<VendorLogo>): Promise<VendorLogo> {
    return this.vendorLogoRepository.findOneBy(find);
  }
  async findOneByFileName(fileName: string): Promise<VendorLogo> {
    return this.vendorLogoRepository.findOneBy({
      fileName: fileName.toLowerCase(),
    });
  }

  async findOne(find: FindOneOptions<VendorLogo>): Promise<VendorLogo> {
    return this.vendorLogoRepository.findOne(find);
  }

  async deleteById(id: string) {
    const deleteLogo = await this.vendorLogoRepository.findOneBy({ id });

    if (!deleteLogo) {
      throw new UnprocessableEntityException({
        statusCode: EnumVendorStatusCodeError.VendorLogoError,
        message: 'product.error.image',
      });
    }
    await this.cloudinaryService.deleteImages({
      publicIds: [deleteLogo.publicId],
    });

    return this.vendorLogoRepository.remove(deleteLogo);
  }

  async createLogo({ logo, subFolder }: ICreateLogo): Promise<VendorLogo> {
    const uploadLogo = this.cloudinaryService.uploadImage({
      subject: CloudinarySubject.Vendor,
      subFolder,
      image: logo,
      languageIsoCode: 'global',
    });

    if (this.cloudinaryService.isUploadApiResponse(uploadLogo)) {
      return this.create({
        fileName: uploadLogo.original_filename,
        assetId: uploadLogo.asset_id,
        publicId: uploadLogo.public_id,
        secureUrl: uploadLogo.secure_url,
      });
    }

    return Promise.resolve(null);
  }
}
