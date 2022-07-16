import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Services
import { UserService } from './service';
// Entities
import { User } from './entity';
//
import { ConnectionNames } from '@/database';

@Module({
  imports: [TypeOrmModule.forFeature([User], ConnectionNames.Default)],
  exports: [UserService],
  providers: [UserService],
  controllers: [],
})
export class UserModule {}
