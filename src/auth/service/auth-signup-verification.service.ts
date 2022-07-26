import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { HelperHashService } from '@/utils/helper/service';

import { SignUpEmailVerificationLink } from '../entity';

import { ConnectionNames } from '@/database';

@Injectable()
export class AuthSignUpVerificationLinkService {
  constructor(
    @InjectRepository(SignUpEmailVerificationLink, ConnectionNames.Default)
    private signUpEmailVerificationLinkRepository: Repository<SignUpEmailVerificationLink>,
    private readonly helperHashService: HelperHashService,
  ) {}

  async create(
    props: DeepPartial<Omit<SignUpEmailVerificationLink, 'code'>>,
  ): Promise<SignUpEmailVerificationLink> {
    return this.signUpEmailVerificationLinkRepository.create({
      ...props,
      code: this.helperHashService.code32char(),
    });
  }

  async save(
    data: SignUpEmailVerificationLink,
  ): Promise<SignUpEmailVerificationLink> {
    return this.signUpEmailVerificationLinkRepository.save<SignUpEmailVerificationLink>(
      data,
    );
  }

  async findOneBy(
    find: FindOptionsWhere<SignUpEmailVerificationLink>,
  ): Promise<SignUpEmailVerificationLink> {
    return this.signUpEmailVerificationLinkRepository.findOneBy(find);
  }

  async findOne(
    find: FindOneOptions<SignUpEmailVerificationLink>,
  ): Promise<SignUpEmailVerificationLink> {
    return this.signUpEmailVerificationLinkRepository.findOne(find);
  }
}
