import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NetworkingModule } from '@/networking/networking.module';

import { User, UserProfile, UserProfileCompany } from './entity';

import {
  UserProfileCompanyService,
  UserProfileService,
  UserService,
} from './service';

import { ConnectionNames } from '@/database/constant';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [User, UserProfile, UserProfileCompany],
      ConnectionNames.Default,
    ),
    forwardRef(() => NetworkingModule),
  ],
  exports: [UserService, UserProfileService, UserProfileCompanyService],
  providers: [UserService, UserProfileService, UserProfileCompanyService],
  controllers: [],
})
export class UserModule {}
