import { ConfigService } from '@nestjs/config';
import { v2, ConfigOptions } from 'cloudinary';
import { CLOUDINARY } from '../cloudinary.constant';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): ConfigOptions => {
    return v2.config({
      cloud_name: process.env.CLD_CLOUD_NAME,
      api_key: process.env.CLD_API_KEY,
      api_secret: process.env.CLD_API_SECRET,
    });
  },
};
