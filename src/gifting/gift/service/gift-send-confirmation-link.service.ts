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
import { GiftSendConfirmationLink } from '../entity';
// Services
import { HelperDateService, HelperHashService } from '@/utils/helper/service';
import { DebuggerService } from '@/debugger/service';
import { EmailService } from '@/messaging/email';
//
import { ConnectionNames } from '@/database';
import { EnumGiftStatusCodeError } from '../gift.constants';

@Injectable()
export class GiftSendConfirmationLinkService {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    @InjectRepository(GiftSendConfirmationLink, ConnectionNames.Default)
    private giftSendVerificationLink: Repository<GiftSendConfirmationLink>,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly debuggerService: DebuggerService,
    private readonly helperDateService: HelperDateService,
    private readonly helperHashService: HelperHashService,
  ) {}

  async create(
    props: DeepPartial<Omit<GiftSendConfirmationLink, 'code'>>,
  ): Promise<GiftSendConfirmationLink> {
    return this.giftSendVerificationLink.create({
      ...props,
      code: this.helperHashService.code32char(),
    });
  }

  async save(
    data: GiftSendConfirmationLink,
  ): Promise<GiftSendConfirmationLink> {
    return this.giftSendVerificationLink.save<GiftSendConfirmationLink>(data);
  }

  async findOneBy(
    find: FindOptionsWhere<GiftSendConfirmationLink>,
  ): Promise<GiftSendConfirmationLink> {
    return this.giftSendVerificationLink.findOneBy(find);
  }

  async findOne(
    find: FindOneOptions<GiftSendConfirmationLink>,
  ): Promise<GiftSendConfirmationLink> {
    return this.giftSendVerificationLink.findOne(find);
  }

  async verifyGiftSend({
    code,
  }: {
    code: string;
  }): Promise<GiftSendConfirmationLink> {
    const existingGiftSendVerificationLink = await this.findOne({
      where: { code },
      relations: ['sender', 'recipient'],
      select: {},
    });

    if (!existingGiftSendVerificationLink) {
      throw new NotFoundException({
        statusCode: EnumGiftStatusCodeError.GiftVerificationNotFound,
        message: 'gift.error.code',
      });
    }

    const now = this.helperDateService.create();
    const expiresAt = this.helperDateService.create({
      date: existingGiftSendVerificationLink.expiresAt,
    });

    if (now > expiresAt || existingGiftSendVerificationLink.usedAt) {
      throw new ForbiddenException({
        statusCode: EnumGiftStatusCodeError.GiftVerificationLinkExpired,
        message: 'gift.error.verificationLink',
      });
    }

    return this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        // existingGiftSendVerificationLink.usedAt =
        //   this.helperDateService.create();
        // existingGiftSendVerificationLink.user.isActive = true;
        // existingGiftSendVerificationLink.user.authConfig.emailVerifiedAt =
        //   existingSignUp.usedAt;

        return transactionalEntityManager.save(
          existingGiftSendVerificationLink,
        );
      },
    );
  }
}
