import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import {
  EnumGiftIntentStatusCodeError,
  EnumMessagingStatusCodeError,
} from '@avo/type';

import { isNumber } from 'class-validator';
import {
  Brackets,
  DataSource,
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  IsNull,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

import { GiftIntent } from '../entity';

import { GiftIntentReadyLinkService } from './gift-intent-ready-link.service';
import { EmailService } from '@/messaging/email/service';
import { HelperDateService } from '@/utils/helper/service';

import { IGiftIntentSearch } from '../type/gift-intent.interface';

import { ConnectionNames } from '@/database/constant';

@Injectable()
export class GiftIntentService {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    @InjectRepository(GiftIntent, ConnectionNames.Default)
    private gifIntentRepository: Repository<GiftIntent>,
    private readonly configService: ConfigService,
    private readonly helperDateService: HelperDateService,
    private readonly giftIntentReadyLinkService: GiftIntentReadyLinkService,
    private readonly emailService: EmailService,
  ) {}

  async create(props: DeepPartial<GiftIntent>): Promise<GiftIntent> {
    return this.gifIntentRepository.create(props);
  }

  async save(props: GiftIntent): Promise<GiftIntent> {
    return this.gifIntentRepository.save(props);
  }

  async saveBulk(props: GiftIntent[]): Promise<GiftIntent[]> {
    return this.gifIntentRepository.save(props);
  }

  async findOne(find: FindOneOptions<GiftIntent>): Promise<GiftIntent> {
    return this.gifIntentRepository.findOne(find);
  }

  async findOneBy(find: FindOptionsWhere<GiftIntent>): Promise<GiftIntent> {
    return this.gifIntentRepository.findOneBy(find);
  }

  async getListSearchBuilder({
    ownerId,
    search,
    loadExtra = true,
  }: IGiftIntentSearch): Promise<SelectQueryBuilder<GiftIntent>> {
    const builder = this.gifIntentRepository
      .createQueryBuilder('giftIntent')
      .leftJoinAndSelect('giftIntent.additionalData', 'additionalData')
      .leftJoinAndSelect('giftIntent.recipient', 'recipient')
      .leftJoinAndSelect('giftIntent.sender', 'sender')
      .leftJoinAndSelect('recipient.user', 'recipientUser')
      .leftJoinAndSelect('recipientUser.profile', 'recipientUserProfile')
      .leftJoinAndSelect('sender.user', 'senderUser')
      .leftJoinAndSelect('senderUser.profile', 'senderUserProfile');

    if (loadExtra) {
      builder
        .leftJoinAndSelect('giftIntent.giftSubmit', 'giftSubmit')
        .leftJoinAndSelect('giftIntent.giftOptions', 'giftOptions')
        .leftJoinAndSelect('giftOptions.products', 'giftProducts')
        .leftJoinAndSelect('giftProducts.displayOptions', 'displayOptions');
    }

    if (ownerId) {
      builder.andWhere('senderUser.id = :ownerId', { ownerId });
    }

    if (search) {
      builder.andWhere(
        new Brackets((qb) => {
          builder.setParameters({ search, likeSearch: `%${search}%` });
          qb.where('senderUser.email ILIKE :likeSearch')
            .orWhere('recipientUser.email ILIKE :likeSearch')
            .orWhere(`recipient.additionalData ->> 'email' ILIKE :likeSearch`)
            .orWhere(`sender.additionalData ->> 'email' ILIKE :likeSearch`);
        }),
      );
    }

    return builder;
  }

  async paginatedSearchBy({
    ownerId,
    search,
    options,
    lang,
  }: IGiftIntentSearch): Promise<GiftIntent[]> {
    const searchBuilder = await this.getListSearchBuilder({
      ownerId,
      search,
      lang,
    });

    if (options.order) {
      searchBuilder.orderBy(options.order);
    }

    if (isNumber(options.take) && isNumber(options.skip)) {
      searchBuilder.take(options.take).skip(options.skip);
    }

    return searchBuilder.getMany();
  }

  async getTotal({ search, ownerId }: IGiftIntentSearch): Promise<number> {
    const searchBuilder = await this.getListSearchBuilder({
      search,
      ownerId,
      loadExtra: false,
    });

    return searchBuilder.getCount();
  }

  async notifyGiftOptionsReady({
    id,
    markAsReady = true,
  }: {
    id: string;
    markAsReady?: boolean;
  }) {
    const giftIntent = await this.findOne({
      where: { id, readyAt: IsNull() },
      relations: [
        'giftOptions',
        'additionalData',
        'recipient',
        'sender',
        'recipient.user',
        'sender.user',
      ],
    });

    if (!giftIntent) {
      throw new UnprocessableEntityException({
        statusCode: EnumGiftIntentStatusCodeError.GiftIntentUnprocessableError,
        message: 'gift.intent.error.unprocessable',
      });
    }

    if (!giftIntent?.giftOptions?.length) {
      throw new UnprocessableEntityException({
        statusCode: EnumGiftIntentStatusCodeError.GiftIntentOptionsEmptyError,
        message: 'gift.intent.error.empty',
      });
    }

    const result = await this.defaultDataSource.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        const readyLink = await this.giftIntentReadyLinkService.create({
          giftIntent,
        });

        const saveReadyLink = await transactionalEntityManager.save(readyLink);

        const emailSent = await this.emailService.sendGiftOptionSelect({
          giftIntent,
          email:
            giftIntent.recipient?.user?.email ||
            giftIntent.recipient?.additionalData['email'],
          code: readyLink.code,
        });

        if (!emailSent) {
          throw new InternalServerErrorException({
            statusCode: EnumMessagingStatusCodeError.MessagingEmailSendError,
            message: 'messaging.error.email.send',
          });
        }

        if (markAsReady) {
          giftIntent.readyAt = this.helperDateService.create();
          await transactionalEntityManager.save(giftIntent);
        }

        return {
          code: saveReadyLink.code,
        };
      },
    );

    // For local development/testing
    const isProduction = this.configService.get<boolean>('app.isProduction');
    const isSecureMode = this.configService.get<boolean>('app.isSecureMode');
    if (!(isProduction || isSecureMode)) {
      return result;
    }
  }

  async notifyGiftShipped({
    id,
    markAsShipped = true,
  }: {
    id: string;
    markAsShipped?: boolean;
  }) {
    const giftIntent = await this.findOne({
      where: { id, shippedAt: IsNull() },
      relations: [
        'giftOptions',
        'additionalData',
        'recipient',
        'sender',
        'recipient.user',
        'sender.user',
      ],
    });

    if (!giftIntent) {
      throw new UnprocessableEntityException({
        statusCode: EnumGiftIntentStatusCodeError.GiftIntentUnprocessableError,
        message: 'gift.intent.error.unprocessable',
      });
    }

    if (!giftIntent?.giftOptions?.length) {
      throw new UnprocessableEntityException({
        statusCode: EnumGiftIntentStatusCodeError.GiftIntentOptionsEmptyError,
        message: 'gift.intent.error.empty',
      });
    }

    const emailSent = await this.emailService.sendGiftShipped({
      email:
        /*
        TODO:
          1. verify if there's an option the email is empty
          2. there should also be a mail for the sender  
      */
        giftIntent.recipient?.user?.email ||
        giftIntent.recipient?.additionalData['email'],
    });

    if (!emailSent) {
      throw new InternalServerErrorException({
        statusCode: EnumMessagingStatusCodeError.MessagingEmailSendError,
        message: 'messaging.error.email.send',
      });
    }

    if (markAsShipped) {
      giftIntent.shippedAt = this.helperDateService.create();
      await this.save(giftIntent);
    }
  }
}