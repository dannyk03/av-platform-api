import { ConnectionNames } from '$/database';
import { TypeormSnakeCaseNamingStrategy } from '$/database/naming-strategy';
import { registerAs } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

export default registerAs(
  'database',
  (): Record<string, boolean | DataSourceOptions> => ({
    debug: process.env.DATABASE_DEBUG === 'true',
    autoCreateDB: process.env.AUTO_CREATE_DB === 'true',
    [ConnectionNames.Default]: {
      type: 'postgres',
      applicationName: process.env.APP_NAME || 'avo',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
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
      migrationsRun: false,
      synchronize: false, // Don't change never!!!
      // autoLoadEntities: true,
    },
  }),
);
