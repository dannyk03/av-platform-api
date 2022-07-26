import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as path from 'path';
import { HeaderResolver, I18nJsonLoader, I18nModule } from 'nestjs-i18n';

import { ResponseMessageService } from './service';

import { EnumMessageLanguage } from './response-message.constant';

@Global()
@Module({
  providers: [ResponseMessageService],
  exports: [ResponseMessageService],
  imports: [
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.get<string>('app.language'),
        fallbacks: Object.values(EnumMessageLanguage).reduce(
          (a, v) => ({ ...a, [`${v}-*`]: v }),
          {},
        ),
        loaderOptions: {
          path: path.join(__dirname, '/languages/'),
          watch: true,
        },
      }),
      loader: I18nJsonLoader,
      inject: [ConfigService],
      resolvers: [new HeaderResolver(['x-custom-lang'])],
    }),
  ],
  controllers: [],
})
export class ResponseMessageModule {}
