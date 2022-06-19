import AppConfig from '@/config/app.config';
import AuthConfig from '@/config/auth.config';
import DatabaseConfig from '@/config/database.config';
import HelperConfig from '@/config/helper.config';
import AwsConfig from '@/config/aws.config';
import UserConfig from './user.config';
import FileConfig from './file.config';
import MiddlewareConfig from './middleware.config';
import { ConfigModule } from '@nestjs/config';

const Configs = [
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
