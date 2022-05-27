import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const env: string = configService.get<string>('app.env');
  const host: string = configService.get<string>('app.http.host');
  const port: number = configService.get<number>('app.http.port');

  const logger = new Logger();
  process.env.NODE_ENV = env;

  // Global Prefix
  app.setGlobalPrefix('/api');
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(port, host);

  logger.log(`==========================================================`);
  logger.log(`App Environment is ${env}`, 'NestApplication');
  logger.log(
    `App Language is ${configService.get<string>('app.language')}`,
    'NestApplication',
  );
  logger.log(
    `App Debug is ${configService.get<boolean>('app.debug')}`,
    'NestApplication',
  );

  logger.log(
    `App Task is ${configService.get<boolean>('app.taskOn')}`,
    'NestApplication',
  );
  logger.log(
    `Database Debug is ${configService.get<boolean>('database.debug')}`,
    'NestApplication',
  );
  logger.log(`==========================================================`);
  logger.log(
    `Database running on ${configService.get<string>(
      'database.host',
    )}/${configService.get<string>('database.name')}`,
    'NestApplication',
  );
  logger.log(`Server running on ${await app.getUrl()}`, 'NestApplication');
  logger.log(`==========================================================`);
}
bootstrap();
