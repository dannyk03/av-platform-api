import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { ForgotPasswordLink } from '../entity';

import { HelperHashService } from '@/utils/helper/service';

import { ConnectionNames } from '@/database/constant';

@Injectable()
export class ForgotPasswordLinkService {
  constructor(
    @InjectRepository(ForgotPasswordLink, ConnectionNames.Default)
    private forgotPasswordLinkRepository: Repository<ForgotPasswordLink>,
    private readonly helperHashService: HelperHashService,
  ) {}

  async create(
    props: DeepPartial<Omit<ForgotPasswordLink, 'code'>>,
  ): Promise<ForgotPasswordLink> {
    return this.forgotPasswordLinkRepository.create({
      ...props,
      code: await this.helperHashService.magicCode(),
    });
  }

  async save(data: ForgotPasswordLink): Promise<ForgotPasswordLink> {
    return this.forgotPasswordLinkRepository.save<ForgotPasswordLink>(data);
  }

  async findOneBy(
    find: FindOptionsWhere<ForgotPasswordLink>,
  ): Promise<ForgotPasswordLink> {
    return this.forgotPasswordLinkRepository.findOneBy(find);
  }

  async findOne(
    find: FindOneOptions<ForgotPasswordLink>,
  ): Promise<ForgotPasswordLink> {
    return this.forgotPasswordLinkRepository.findOne(find);
  }
}
