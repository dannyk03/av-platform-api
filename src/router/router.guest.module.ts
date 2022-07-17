import { Module } from '@nestjs/common';
// Modules
import { UserModule } from '@/user/user.module';

// Services

@Module({
  controllers: [],
  providers: [],
  exports: [],
  imports: [UserModule],
})
export class RouterGuestModule {}
