import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SignUpEmailVerificationLink, UserAuthConfig } from './entity';

import { AuthService, AuthSignUpVerificationLinkService } from './service';

import { JwtRefreshStrategy } from './guards/jwt-refresh/auth.jwt-refresh.strategy';
import { JwtStrategy } from '@/auth/guards/jwt/auth.jwt.strategy';

import { ConnectionNames } from '@/database/constants';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [UserAuthConfig, SignUpEmailVerificationLink],
      ConnectionNames.Default,
    ),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    AuthSignUpVerificationLinkService,
  ],
  exports: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    AuthSignUpVerificationLinkService,
  ],
  controllers: [],
})
export class AuthModule {}
