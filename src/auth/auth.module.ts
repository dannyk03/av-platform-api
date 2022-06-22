import { Module } from '@nestjs/common';
import { JwtStrategy } from '@/auth/guard/jwt/auth.jwt.strategy';
import { JwtRefreshStrategy } from './guard/jwt-refresh/auth.jwt-refresh.strategy';
import { AuthService } from './service/auth.service';

@Module({
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService, JwtStrategy, JwtRefreshStrategy],
  controllers: [],
  imports: [],
})
export class AuthModule {}
