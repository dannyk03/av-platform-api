import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NetworkingModule } from '@/networking/networking.module';

import { User, UserProfile } from './entity';

import { UserProfileService, UserService } from './service';

import { ConnectionNames } from '@/database/constant';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProfile], ConnectionNames.Default),
    forwardRef(() => NetworkingModule),
  ],
  exports: [UserService, UserProfileService],
  providers: [UserService, UserProfileService],
  controllers: [],
})
export class UserModule {}
