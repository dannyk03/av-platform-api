import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { HeaderResolver, I18nJsonLoader, I18nModule } from 'nestjs-i18n';
import path from 'path';

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
          path: path.join(__dirname, '../i18n-languages'),
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
