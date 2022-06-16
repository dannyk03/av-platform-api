import AppConfig from 'src/config/app.config';
import AuthConfig from 'src/config/auth.config';
import DatabaseConfig from 'src/config/database.config';
import HelperConfig from 'src/config/helper.config';
import AwsConfig from 'src/config/aws.config';
import UserConfig from './user.config';
import FileConfig from './file.config';
import MiddlewareConfig from './middleware.config';
import { ConfigModule } from '@nestjs/config';

export const Configs = [
  AppConfig,
  AuthConfig,
  DatabaseConfig,
  HelperConfig,
  AwsConfig,
  UserConfig,
  MiddlewareConfig,
  FileConfig,
];

export const ConfigDynamicModule = ConfigModule.forRoot({
  load: Configs,
  ignoreEnvFile: false,
  isGlobal: true,
  cache: true,
  envFilePath: ['.env'],
});
