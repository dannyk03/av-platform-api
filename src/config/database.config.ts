import { ConnectionNames } from '@/database';
import { TypeormSnakeCaseNamingStrategy } from '@/database/naming-strategy';
import { registerAs } from '@nestjs/config';

export default registerAs(
  'database',
  (): Record<string, any> => ({
    debug: process.env.DATABASE_DEBUG === 'true',
    [ConnectionNames.Default]: {
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      database: process.env.DATABASE_NAME || 'avo',
      password: process.env.DATABASE_PASSWORD || null,
      username: process.env.DATABASE_USERNAME,
      logging: process.env.DATABASE_DEBUG === 'true',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [
        __dirname +
          `/../database/migrations/${ConnectionNames.Default}/**/*{.ts,.js}`,
      ],
      namingStrategy: new TypeormSnakeCaseNamingStrategy(),
      migrationsRun: true,
      // autoLoadEntities: true,
    },
  }),
);
