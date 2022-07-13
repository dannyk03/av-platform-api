import { Module, Global } from '@nestjs/common';
import * as path from 'path';
import { I18nModule, HeaderResolver, I18nJsonLoader } from 'nestjs-i18n';
import { ConfigService } from '@nestjs/config';
import { EnumMessageLanguage } from './response-message.constant';
import { ResponseMessageService } from './service/response-message.service';

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
