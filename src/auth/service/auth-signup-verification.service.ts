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
import { HelperDateService } from '@/utils/helper/service';
import { DebuggerService } from '@/debugger/service';
import { EmailService } from '@/messaging/service/email';
//
import { ConnectionNames } from '@/database';
import { EnumUserStatusCodeError } from '@/user';
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

  async verifyUserSignUp({
    signUpCode,
  }: {
    signUpCode: string;
  }): Promise<SignUpEmailVerificationLink> {
    const existingSignUp = await this.findOne({
      where: { signUpCode },
      relations: ['user', 'user.authConfig'],
      select: {
        user: {
          id: true,
          isActive: true,
          authConfig: {
            id: true,
            emailVerifiedAt: true,
          },
        },
      },
    });

    if (!existingSignUp) {
      throw new NotFoundException({
        statusCode: EnumUserStatusCodeError.UserSignUpLinkNotFound,
        message: 'user.error.signUpCode',
      });
    }

    const now = this.helperDateService.create();
    const expiresAt = this.helperDateService.create({
      date: existingSignUp.expiresAt,
    });

    if (now > expiresAt || existingSignUp.usedAt) {
      throw new ForbiddenException({
        statusCode: EnumUserStatusCodeError.UserSignUpLinkExpired,
        message: 'user.error.signUpLink',
      });
    }

    return this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        existingSignUp.usedAt = this.helperDateService.create();
        existingSignUp.user.isActive = true;
        existingSignUp.user.authConfig.emailVerifiedAt = existingSignUp.usedAt;

        return transactionalEntityManager.save(existingSignUp);
      },
    );
  }
}
