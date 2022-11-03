import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { HelperAppService } from './service';
import { HelperArrayService } from './service/helper.array.service';
import { HelperCookieService } from './service/helper.cookie.service';
import { HelperDateService } from './service/helper.date.service';
import { HelperEncryptionService } from './service/helper.encryption.service';
import { HelperFileService } from './service/helper.file.service';
import { HelperGeoService } from './service/helper.geo.service';
import { HelperHashService } from './service/helper.hash.service';
import { HelperJwtService } from './service/helper.jwt.service';
import { HelperMaskService } from './service/helper.mask.service';
import { HelperPhoneNumberService } from './service/helper.mobile-number.service';
import { HelperNumberService } from './service/helper.number.service';
import { HelperPromiseService } from './service/helper.promise.service';
import { HelperService } from './service/helper.service';
import { HelperSlugService } from './service/helper.slug.service';
import { HelperStringService } from './service/helper.string.service';

@Global()
@Module({
  providers: [
    HelperService,
    HelperSlugService,
    HelperArrayService,
    HelperDateService,
    HelperEncryptionService,
    HelperHashService,
    HelperNumberService,
    HelperStringService,
    HelperFileService,
    HelperGeoService,
    HelperJwtService,
    HelperPhoneNumberService,
    HelperCookieService,
    HelperPromiseService,
    HelperMaskService,
    HelperAppService,
  ],
  exports: [
    HelperService,
    HelperSlugService,
    HelperArrayService,
    HelperDateService,
    HelperEncryptionService,
    HelperHashService,
    HelperNumberService,
    HelperStringService,
    HelperFileService,
    HelperGeoService,
    HelperJwtService,
    HelperPhoneNumberService,
    HelperCookieService,
    HelperPromiseService,
    HelperMaskService,
    HelperAppService,
  ],
  controllers: [],
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('helper.jwt.defaultSecretKey'),
          signOptions: {
            expiresIn: configService.get<string>(
              'helper.jwt.defaultExpirationTime',
            ),
          },
        };
      },
    }),
  ],
})
export class HelperModule {}
