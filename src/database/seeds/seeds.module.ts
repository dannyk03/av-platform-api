import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { UserSeed } from './user.seed';
import { UserModule } from 'src/user/user.module';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [CoreModule, CommandModule, UserModule],
  providers: [UserSeed],
  exports: [],
})
export class SeedsModule {}
