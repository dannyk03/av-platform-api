import { ConfigService } from '@nestjs/config';
import { v2, ConfigOptions } from 'cloudinary';
import { CLOUDINARY } from '../cloudinary.constant';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): ConfigOptions => {
    return v2.config({
      secure: true,
      cloud_name: configService.get<string>('cloudinary.credential.cloudName'),
      api_key: configService.get<string>('cloudinary.credential.key'),
      api_secret: configService.get<string>('cloudinary.credential.secret'),
    });
  },
};
