import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@/user/user.module';

import {
  Connection,
  ConnectionRequest,
  ConnectionRequestBlock,
} from './entity';

import { ConnectionNames } from '@/database';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Connection, ConnectionRequest, ConnectionRequestBlock],
      ConnectionNames.Default,
    ),
    UserModule,
  ],

  exports: [],
  providers: [],
  controllers: [],
})
export class NetworkingModule {}
