import { ConfigService } from '@nestjs/config';

import { ConfigOptions, v2 } from 'cloudinary';

import { CLOUDINARY } from '../cloudinary.constant';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): ConfigOptions => {
    return v2.config({
      secure: true,
      cloud_name: configService.get<string>('cloudinary.credentials.cloudName'),
      api_key: configService.get<string>('cloudinary.credentials.key'),
      api_secret: configService.get<string>('cloudinary.credentials.secret'),
    });
  },
};
