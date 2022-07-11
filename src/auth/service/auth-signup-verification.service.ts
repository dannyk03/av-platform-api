import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
// Entities
import { SignUpEmailVerificationLink } from '../entity/signup-email-verification-link.entity';
// Services
import { HelperDateService } from '@/utils/helper/service/helper.date.service';
//
import { ConnectionNames } from '@/database';
import { DebuggerService } from '@/debugger/service';
import { EmailService } from '@/messaging/service';

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
}
