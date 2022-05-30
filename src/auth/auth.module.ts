import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';

@Module({
  providers: [AuthService],
  exports: [AuthService],
  controllers: [],
  imports: [],
})
export class AuthModule {}
