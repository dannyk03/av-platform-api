import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  FindOptionsWhere,
  Repository,
  FindOneOptions,
} from 'typeorm';
// Services
import { EmailService } from '@/messaging/service/email/email.service';
import { DebuggerService } from '@/debugger/service/debugger.service';
import { HelperDateService } from '@/utils/helper/service/helper.date.service';
// Entities
import { GiftSend } from '../entity/gift-send.entity';
//
import { ConnectionNames } from '@/database';

@Injectable()
export class GiftSendService {
  constructor(
    @InjectRepository(GiftSend, ConnectionNames.Default)
    private GifSendRepository: Repository<GiftSend>,
    private readonly configService: ConfigService,
    private readonly debuggerService: DebuggerService,
  ) {}

  async create(props: DeepPartial<GiftSend>): Promise<GiftSend> {
    return this.GifSendRepository.create(props);
  }

  async save(props: GiftSend): Promise<GiftSend> {
    return this.GifSendRepository.save(props);
  }

  async saveBulk(props: GiftSend[]): Promise<GiftSend[]> {
    return this.GifSendRepository.save(props);
  }

  async findOne(find: FindOneOptions<GiftSend>): Promise<GiftSend> {
    return this.GifSendRepository.findOne(find);
  }

  async findOneBy(find: FindOptionsWhere<GiftSend>): Promise<GiftSend> {
    return this.GifSendRepository.findOneBy(find);
  }
}
