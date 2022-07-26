import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtStrategy } from '@/auth/guard/jwt/auth.jwt.strategy';
import { ConnectionNames } from '@/database';

import { SignUpEmailVerificationLink, UserAuthConfig } from './entity';
import { JwtRefreshStrategy } from './guard/jwt-refresh/auth.jwt-refresh.strategy';
import { AuthService, AuthSignUpVerificationLinkService } from './service';

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
