import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  ForgotPasswordLink,
  SignUpEmailVerificationLink,
  UserAuthConfig,
} from './entity';

import {
  AuthService,
  AuthSignUpVerificationLinkService,
  ForgotPasswordLinkService,
} from './service';

import { JwtRefreshStrategy } from './guard/jwt-refresh/auth.jwt-refresh.strategy';
import { JwtStrategy } from '@/auth/guard/jwt/auth.jwt.strategy';

import { ConnectionNames } from '@/database/constant';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [UserAuthConfig, SignUpEmailVerificationLink, ForgotPasswordLink],
      ConnectionNames.Default,
    ),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    AuthSignUpVerificationLinkService,
    ForgotPasswordLinkService,
  ],
  exports: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    AuthSignUpVerificationLinkService,
    ForgotPasswordLinkService,
  ],
  controllers: [],
})
export class AuthModule {}
