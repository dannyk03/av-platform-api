import { ConfigModule } from '@nestjs/config';

import AppConfig from './app.config';
import AuthConfig from './auth.config';
import AwsConfig from './aws.config';
import CloudinaryConfig from './cloudinary.config';
import CustomerIoConfig from './customer-io.config';
import DatabaseConfig from './database.config';
import FileConfig from './file.config';
import HelperConfig from './helper.config';
import MiddlewareConfig from './middleware.config';
import OrganizationConfig from './organization.config';
import UserConfig from './user.config';

const Configs = [
  AppConfig,
  AuthConfig,
  DatabaseConfig,
  HelperConfig,
  AwsConfig,
  UserConfig,
  MiddlewareConfig,
  FileConfig,
  OrganizationConfig,
  CloudinaryConfig,
  CustomerIoConfig,
];

export const ConfigDynamicModule = ConfigModule.forRoot({
  load: Configs,
  ignoreEnvFile: false,
  isGlobal: true,
  cache: true,
  envFilePath: ['.env'],
});
