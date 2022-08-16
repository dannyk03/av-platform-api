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

import { plainToInstance } from 'class-transformer';
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
import { HelperDateService } from '@/utils/helper/service';

import {
  GiftIntentSerialization,
  RecipientAdditionalDataSerialization,
  SenderAdditionalDataSerialization,
} from '../serialization';
import { GiftIntentReadySerialization } from '../serialization/gift-intent-ready.serialization';

import { IGiftIntentSearch } from '../gift-intent.interface';

import { ConnectionNames } from '@/database';
import { EmailService } from '@/messaging/email';

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
    search,
    loadExtra = true,
  }: IGiftIntentSearch): Promise<SelectQueryBuilder<GiftIntent>> {
    const builder = this.gifIntentRepository
      .createQueryBuilder('giftIntent')
      .leftJoinAndSelect('giftIntent.additionalData', 'additionalData')
      .leftJoinAndSelect('giftIntent.recipient', 'recipient')
      .leftJoinAndSelect('giftIntent.sender', 'sender')
      .leftJoinAndSelect('recipient.user', 'recipientUser')
      .leftJoinAndSelect('sender.user', 'senderUser');

    if (loadExtra) {
      builder
        .leftJoinAndSelect('giftIntent.giftSubmit', 'giftSubmit')
        .leftJoinAndSelect('giftIntent.giftOptions', 'giftOptions')
        .leftJoinAndSelect('giftOptions.products', 'giftProducts');
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
    search,
    options,
  }: IGiftIntentSearch): Promise<GiftIntent[]> {
    const searchBuilder = await this.getListSearchBuilder({
      search,
    });

    if (options.order) {
      searchBuilder.orderBy(options.order);
    }

    if (isNumber(options.take) && isNumber(options.skip)) {
      searchBuilder.take(options.take).skip(options.skip);
    }

    return searchBuilder.getMany();
  }

  async getTotal({ search }: IGiftIntentSearch): Promise<number> {
    const searchBuilder = await this.getListSearchBuilder({
      search,
      loadExtra: false,
    });

    return searchBuilder.getCount();
  }

  async notifyReady({ id }) {
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

        const emailSent = await this.emailService.sendGiftReady({
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
        giftIntent.readyAt = this.helperDateService.create();

        await transactionalEntityManager.save(giftIntent);

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

  async serializationSenderGiftAdditionalData(data: any): Promise<any> {
    return plainToInstance(SenderAdditionalDataSerialization, data);
  }
  async serializationRecipientGiftAdditionalData(data: any): Promise<any> {
    return plainToInstance(RecipientAdditionalDataSerialization, data);
  }

  async serializationGiftIntentList(
    data: GiftIntent[],
  ): Promise<GiftIntentSerialization[]> {
    return plainToInstance(GiftIntentSerialization, data);
  }

  async serializationGiftIntent(
    data: GiftIntent,
  ): Promise<GiftIntentSerialization> {
    return plainToInstance(GiftIntentSerialization, data);
  }

  async serializationGiftIntentReady(
    data: GiftIntent,
  ): Promise<GiftIntentReadySerialization> {
    return plainToInstance(GiftIntentReadySerialization, data);
  }
}
