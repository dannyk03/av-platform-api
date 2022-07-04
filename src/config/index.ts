import { ConfigModule } from '@nestjs/config';
import AppConfig from './app.config';
import AuthConfig from './auth.config';
import DatabaseConfig from './database.config';
import HelperConfig from './helper.config';
import AwsConfig from './aws.config';
import UserConfig from './user.config';
import FileConfig from './file.config';
import MiddlewareConfig from './middleware.config';
import OrganizationConfig from './organization.config';

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
];

export const ConfigDynamicModule = ConfigModule.forRoot({
  load: Configs,
  ignoreEnvFile: false,
  isGlobal: true,
  cache: true,
  envFilePath: ['.env'],
});
