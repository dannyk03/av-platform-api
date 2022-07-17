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
import { DebuggerService } from '@/debugger/service';
// Entities
import { GuestGiftSend } from '../entity';
//
import { ConnectionNames } from '@/database';

@Injectable()
export class GiftSendGuestService {
  constructor(
    @InjectRepository(GuestGiftSend, ConnectionNames.Default)
    private gifSendGuestRepository: Repository<GuestGiftSend>,
    private readonly configService: ConfigService,
    private readonly debuggerService: DebuggerService,
  ) {}

  async create(props: DeepPartial<GuestGiftSend>): Promise<GuestGiftSend> {
    return this.gifSendGuestRepository.create(props);
  }

  async save(props: GuestGiftSend): Promise<GuestGiftSend> {
    return this.gifSendGuestRepository.save(props);
  }

  async saveBulk(props: GuestGiftSend[]): Promise<GuestGiftSend[]> {
    return this.gifSendGuestRepository.save(props);
  }

  async findOne(find: FindOneOptions<GuestGiftSend>): Promise<GuestGiftSend> {
    return this.gifSendGuestRepository.findOne(find);
  }

  async findOneBy(
    find: FindOptionsWhere<GuestGiftSend>,
  ): Promise<GuestGiftSend> {
    return this.gifSendGuestRepository.findOneBy(find);
  }
}
