import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { ResetPasswordLink } from '../entity';

import { HelperHashService } from '@/utils/helper/service';

import { ConnectionNames } from '@/database/constant';

@Injectable()
export class ForgotPasswordLinkService {
  constructor(
    @InjectRepository(ResetPasswordLink, ConnectionNames.Default)
    private forgotPasswordLinkRepository: Repository<ResetPasswordLink>,
    private readonly helperHashService: HelperHashService,
  ) {}

  async create(
    props: DeepPartial<Omit<ResetPasswordLink, 'code'>>,
  ): Promise<ResetPasswordLink> {
    return this.forgotPasswordLinkRepository.create({
      ...props,
      code: await this.helperHashService.magicCode(),
    });
  }

  async save(data: ResetPasswordLink): Promise<ResetPasswordLink> {
    return this.forgotPasswordLinkRepository.save<ResetPasswordLink>(data);
  }

  async findOneBy(
    find: FindOptionsWhere<ResetPasswordLink>,
  ): Promise<ResetPasswordLink> {
    return this.forgotPasswordLinkRepository.findOneBy(find);
  }

  async findOne(
    find: FindOneOptions<ResetPasswordLink>,
  ): Promise<ResetPasswordLink> {
    return this.forgotPasswordLinkRepository.findOne(find);
  }
}
