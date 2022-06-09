import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { JwtStrategy } from 'src/auth/guard/jwt/auth.jwt.strategy';
import { ConnectionNames } from 'src/database/database.constant';
import { DebuggerService } from 'src/debugger/service/debugger.service';
import { ApiKeyGuard } from './guard/api-key/auth.api-key.guard';
import { ApiKeyStrategy } from './guard/api-key/auth.api-key.strategy';
import { JwtRefreshStrategy } from './guard/jwt-refresh/auth.jwt-refresh.strategy';
import { AuthApi } from './entity/auth.api.entity';
import { AuthApiBulkService } from './service/auth.api.bulk.service';
import { AuthApiService } from './service/auth.api.service';
import { AuthService } from './service/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [
    AuthService,
    AuthApiService,
    AuthApiBulkService,
    JwtStrategy,
    JwtRefreshStrategy,
    ApiKeyStrategy,
    {
      provide: APP_GUARD,
      inject: [DebuggerService, ConfigService, Reflector],
      useFactory: (
        debuggerService: DebuggerService,
        configService: ConfigService,
        reflector: Reflector,
      ) => {
        return new ApiKeyGuard(debuggerService, configService, reflector);
      },
    },
  ],
  exports: [AuthService, AuthApiService, AuthApiBulkService],
  controllers: [],
  imports: [TypeOrmModule.forFeature([AuthApi], ConnectionNames.Default)],
})
export class AuthModule {}
