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
import { GiftSendVerificationLink } from '../entity';
// Services
import { HelperDateService, HelperHashService } from '@/utils/helper/service';
import { DebuggerService } from '@/debugger/service';
import { EmailService } from '@/messaging/service/email';
//
import { ConnectionNames } from '@/database';
import { EnumGiftStatusCodeError } from '../gift.constants';

@Injectable()
export class GiftSendVerificationLinkService {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    @InjectRepository(GiftSendVerificationLink, ConnectionNames.Default)
    private giftSendVerificationLink: Repository<GiftSendVerificationLink>,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly debuggerService: DebuggerService,
    private readonly helperDateService: HelperDateService,
    private readonly helperHashService: HelperHashService,
  ) {}

  async create(
    props: DeepPartial<Omit<GiftSendVerificationLink, 'code'>>,
  ): Promise<GiftSendVerificationLink> {
    return this.giftSendVerificationLink.create({
      ...props,
      code: this.helperHashService.code32char(),
    });
  }

  async save(
    data: GiftSendVerificationLink,
  ): Promise<GiftSendVerificationLink> {
    return this.giftSendVerificationLink.save<GiftSendVerificationLink>(data);
  }

  async findOneBy(
    find: FindOptionsWhere<GiftSendVerificationLink>,
  ): Promise<GiftSendVerificationLink> {
    return this.giftSendVerificationLink.findOneBy(find);
  }

  async findOne(
    find: FindOneOptions<GiftSendVerificationLink>,
  ): Promise<GiftSendVerificationLink> {
    return this.giftSendVerificationLink.findOne(find);
  }

  async verifyGiftSend({
    code,
  }: {
    code: string;
  }): Promise<GiftSendVerificationLink> {
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
