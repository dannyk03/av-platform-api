import { Module } from '@nestjs/common';
// Entities
import { UserAuthConfig } from './entity/user-auth-config.entity';
//
import { JwtStrategy } from '@/auth/guard/jwt/auth.jwt.strategy';
import { JwtRefreshStrategy } from './guard/jwt-refresh/auth.jwt-refresh.strategy';
import { AuthService } from './service/auth.service';
import { ConnectionNames } from '@/database';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAuthConfig], ConnectionNames.Default),
  ],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService, JwtStrategy, JwtRefreshStrategy],
  controllers: [],
})
export class AuthModule {}
