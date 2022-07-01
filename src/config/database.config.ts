import { registerAs } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

import { ConnectionNames } from '@/database';
import { TypeormSnakeCaseNamingStrategy } from '@/database/naming-strategy';
import { createDB } from '@/database/utils.database';

const connectionOpts: Record<ConnectionNames, DataSourceOptions> = {
  [ConnectionNames.Default]: {
    type: 'postgres',
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
    migrationsRun: true,
    synchronize: false, // Don't change
    // autoLoadEntities: true,
  },
};

export default registerAs(
  'database',
  async (): Promise<Record<string, boolean | DataSourceOptions>> => {
    if (process.env.AUTO_CREATE_DB === 'true') {
      await createDB(connectionOpts[ConnectionNames.Default]);
    }

    return {
      debug: process.env.DATABASE_DEBUG === 'true',
      [ConnectionNames.Default]: connectionOpts[ConnectionNames.Default],
    };
  },
);
