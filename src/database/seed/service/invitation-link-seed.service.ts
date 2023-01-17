import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';

import { DataSource } from 'typeorm';

import { InvitationLinkService } from '@/networking/service';
import { UserService } from '@/user/service';

import { ConnectionNames } from '@/database/constant/database.constant';

@Injectable()
export class InvitationLinkSeedService {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    private readonly invitationLinkService: InvitationLinkService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async insert(): Promise<void> {
    const runSeeds = this.configService.get<boolean>('app.runSeeds');

    if (!runSeeds) {
      return;
    }

    try {
      await this.defaultDataSource.transaction(
        'SERIALIZABLE',
        async (transactionalEntityManager) => {
          const allUsers = await this.userService.find();
          const entities = allUsers.map((currentUser) => ({
            user: currentUser,
          }));
          const entitiesToSave = await this.invitationLinkService.createMany(
            entities,
          );
          await transactionalEntityManager.save(entitiesToSave);
        },
      );
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
