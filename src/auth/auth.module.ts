import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

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
import { TwilioService } from '@/messaging/twilio/service';

import { JwtRefreshStrategy } from './guard/jwt-refresh/auth.jwt-refresh.strategy';
import { JwtStrategy } from '@/auth/guard/jwt/auth.jwt.strategy';

import { ConnectionNames } from '@/database/constant';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [UserAuthConfig, SignUpEmailVerificationLink, ResetPasswordLink],
      ConnectionNames.Default,
    ),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    AuthSignUpVerificationLinkService,
    ResetPasswordLinkService,
    TwilioService,
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
