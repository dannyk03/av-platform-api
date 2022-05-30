import AppConfig from '@/config/app.config';
import AuthConfig from '@/config/auth.config';
import DatabaseConfig from '@/config/database.config';
import HelperConfig from '@/config/helper.config';
import AwsConfig from '@/config/aws.config';
import UserConfig from './user.config';
import FileConfig from './file.config';
import MiddlewareConfig from './middleware.config';

export default [
    AppConfig,
    AuthConfig,
    DatabaseConfig,
    HelperConfig,
    AwsConfig,
    UserConfig,
    MiddlewareConfig,
    FileConfig,
];
