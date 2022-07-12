import { Module } from '@nestjs/common';

import { ConnectionNames } from '@/database';
import { TypeOrmModule } from '@nestjs/typeorm';
// Services
// import { UserService } from './service/user.service';
// Entities

//

@Module({
  imports: [TypeOrmModule.forFeature([Product], ConnectionNames.Default)],
  exports: [UserService],
  providers: [UserService],
  controllers: [],
})
export class CatalogModule {}
