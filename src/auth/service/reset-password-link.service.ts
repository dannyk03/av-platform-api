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
export class ResetPasswordLinkService {
  constructor(
    @InjectRepository(ResetPasswordLink, ConnectionNames.Default)
    private resetPasswordLinkRepository: Repository<ResetPasswordLink>,
    private readonly helperHashService: HelperHashService,
  ) {}

  async create(
    props: DeepPartial<Omit<ResetPasswordLink, 'code'>>,
  ): Promise<ResetPasswordLink> {
    return this.resetPasswordLinkRepository.create({
      ...props,
      code: await this.helperHashService.magicCode(),
    });
  }

  async save(data: ResetPasswordLink): Promise<ResetPasswordLink> {
    return this.resetPasswordLinkRepository.save<ResetPasswordLink>(data);
  }

  async findOneBy(
    find: FindOptionsWhere<ResetPasswordLink>,
  ): Promise<ResetPasswordLink> {
    return this.resetPasswordLinkRepository.findOneBy(find);
  }

  async findOne(
    find: FindOneOptions<ResetPasswordLink>,
  ): Promise<ResetPasswordLink> {
    return this.resetPasswordLinkRepository.findOne(find);
  }
}
