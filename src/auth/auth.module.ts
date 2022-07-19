import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Entities
import { UserAuthConfig } from './entity';
import { SignUpEmailVerificationLink } from './entity';
// Services
import { JwtStrategy } from '@/auth/guard/jwt/auth.jwt.strategy';
import { JwtRefreshStrategy } from './guard/jwt-refresh/auth.jwt-refresh.strategy';
import { EmailService } from '@/messaging/email';
import { AuthService, AuthSignUpVerificationService } from './service';
//
import { ConnectionNames } from '@/database';

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
    AuthSignUpVerificationService,
    EmailService,
  ],
  exports: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    AuthSignUpVerificationService,
  ],
  controllers: [],
})
export class AuthModule {}
