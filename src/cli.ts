import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { CommandModule, CommandService } from 'nestjs-command';

import { CommandsModule } from './database/commands/commands.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(CommandsModule, {
    logger: ['error'],
  });

  const logger = new Logger();

  try {
    await app.select(CommandModule).get(CommandService).exec();
    await app.close();
  } catch (error) {
    logger.error(error, 'NestJsCommand');
    await app.close();
    process.exit(1);
  }
}

bootstrap();
