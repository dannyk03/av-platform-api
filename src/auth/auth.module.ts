import { Module } from '@nestjs/common';
import { JwtStrategy } from '@/auth/guard/jwt/auth.jwt.strategy';
import { JwtRefreshStrategy } from './guard/jwt-refresh/auth.jwt-refresh.strategy';
// import { AuthApi } from './entity/auth.api.entity';

import { AuthService } from './service/auth.service';

@Module({
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    // {
    //   provide: APP_GUARD,
    //   inject: [DebuggerService, ConfigService, Reflector],
    //   useFactory: (
    //     debuggerService: DebuggerService,
    //     configService: ConfigService,
    //     reflector: Reflector,
    //   ) => {
    //     return new JwtGuard(debuggerService, configService, reflector);
    //   },
    // },
  ],
  exports: [AuthService],
  controllers: [],
  imports: [],
})
export class AuthModule {}
