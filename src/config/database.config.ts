import { ConnectionNames } from '@/database';
import { TypeormSnakeCaseNamingStrategy } from '@/database/naming-strategy';
import { registerAs } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

export default registerAs(
  'database',
  (): Record<string, boolean | DataSourceOptions> => ({
    debug: process.env.DATABASE_DEBUG === 'true',
    [ConnectionNames.Default]: {
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10) || 123,
      database: process.env.POSTGRES_DB || 'avo',
      password: process.env.POSTGRES_PASSWORD || null,
      username: process.env.POSTGRES_USER,
      logging: process.env.DATABASE_DEBUG === 'true',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [
        __dirname +
          `/../database/migrations/${ConnectionNames.Default}/**/*{.ts,.js}`,
      ],
      namingStrategy: new TypeormSnakeCaseNamingStrategy(),
      migrationsRun: process.env.APP_ENV === 'production',
      // autoLoadEntities: true,
    },
  }),
);
