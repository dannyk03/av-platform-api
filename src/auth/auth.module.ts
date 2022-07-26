import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SignUpEmailVerificationLink, UserAuthConfig } from './entity';

import { AuthService, AuthSignUpVerificationLinkService } from './service';

import { JwtStrategy } from '@/auth/guard/jwt/auth.jwt.strategy';
import { ConnectionNames } from '@/database';

import { JwtRefreshStrategy } from './guard/jwt-refresh/auth.jwt-refresh.strategy';

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
