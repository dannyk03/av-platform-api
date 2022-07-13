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
import { SignUpEmailVerificationLink } from '../entity';
// Services
import { HelperDateService } from '@/utils/helper/service/helper.date.service';
//
import { ConnectionNames } from '@/database';
import { DebuggerService } from '@/debugger/service';
import { EmailService } from '@/messaging/service/email/email.service';

@Injectable()
export class AuthSignUpVerificationService {
  constructor(
    @InjectRepository(SignUpEmailVerificationLink, ConnectionNames.Default)
    private signUpEmailVerificationLinkRepository: Repository<SignUpEmailVerificationLink>,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly debuggerService: DebuggerService,
    private readonly helperDateService: HelperDateService,
  ) {}

  async create(
    props: DeepPartial<SignUpEmailVerificationLink>,
  ): Promise<SignUpEmailVerificationLink> {
    return this.signUpEmailVerificationLinkRepository.create(props);
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
