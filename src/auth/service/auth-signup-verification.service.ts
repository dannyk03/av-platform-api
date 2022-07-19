import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
// Entities
import { SignUpEmailVerificationLink } from '../entity';
// Services
import { HelperDateService, HelperHashService } from '@/utils/helper/service';
import { DebuggerService } from '@/debugger/service';
import { EmailService } from '@/messaging/email';
//
import { ConnectionNames } from '@/database';

@Injectable()
export class AuthSignUpVerificationService {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    @InjectRepository(SignUpEmailVerificationLink, ConnectionNames.Default)
    private signUpEmailVerificationLinkRepository: Repository<SignUpEmailVerificationLink>,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly debuggerService: DebuggerService,
    private readonly helperDateService: HelperDateService,
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
