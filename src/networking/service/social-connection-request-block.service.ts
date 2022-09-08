import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { SocialConnectionRequestBlock } from '../entity';

import { ConnectionNames } from '@/database/constant';

@Injectable()
export class SocialConnectionRequestBlockService {
  constructor(
    @InjectRepository(SocialConnectionRequestBlock, ConnectionNames.Default)
    private socialConnectionRequestBlockRepository: Repository<SocialConnectionRequestBlock>,
  ) {}

  async create(
    props: DeepPartial<SocialConnectionRequestBlock>,
  ): Promise<SocialConnectionRequestBlock> {
    return this.socialConnectionRequestBlockRepository.create(props);
  }

  async save(
    socialConnectionRequestBlock: SocialConnectionRequestBlock,
  ): Promise<SocialConnectionRequestBlock> {
    return this.socialConnectionRequestBlockRepository.save<SocialConnectionRequestBlock>(
      socialConnectionRequestBlock,
    );
  }

  async findOne(
    find: FindOneOptions<SocialConnectionRequestBlock>,
  ): Promise<SocialConnectionRequestBlock> {
    return this.socialConnectionRequestBlockRepository.findOne(find);
  }

  async findOneBy(
    find:
      | FindOptionsWhere<SocialConnectionRequestBlock>
      | FindOptionsWhere<SocialConnectionRequestBlock>[],
  ): Promise<SocialConnectionRequestBlock> {
    return this.socialConnectionRequestBlockRepository.findOneBy(find);
  }

  async findBlockRequest({
    fromEmail,
    toEmail,
  }: {
    fromEmail: string;
    toEmail: string;
  }) {
    return this.socialConnectionRequestBlockRepository
      .createQueryBuilder('socialConnectionRequestBlock')
      .setParameters({ fromEmail, toEmail })
      .leftJoinAndSelect(
        'socialConnectionRequestBlock.blockingUser',
        'blockingUser',
      )
      .leftJoinAndSelect(
        'socialConnectionRequestBlock.blockedUser',
        'blockedUser',
      )
      .where('blockingUser.email = :fromEmail')
      .andWhere('blockedUser.email = :toEmail')
      .getOne();
  }
}
