import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessagingModule } from '@/messaging/messaging.module';

import {
  ResetPasswordLink,
  SignUpEmailVerificationLink,
  UserAuthConfig,
} from './entity';

import {
  AuthService,
  AuthSignUpVerificationLinkService,
  ResetPasswordLinkService,
} from './service';

import { JwtRefreshStrategy } from './guard/jwt-refresh/auth.jwt-refresh.strategy';
import { JwtStrategy } from '@/auth/guard/jwt/auth.jwt.strategy';

import { ConnectionNames } from '@/database/constant';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [UserAuthConfig, SignUpEmailVerificationLink, ResetPasswordLink],
      ConnectionNames.Default,
    ),
    MessagingModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    AuthSignUpVerificationLinkService,
    ResetPasswordLinkService,
  ],
  exports: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    AuthSignUpVerificationLinkService,
    ResetPasswordLinkService,
  ],
  controllers: [],
})
export class AuthModule {}
