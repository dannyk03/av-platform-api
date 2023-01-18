import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Command } from 'nestjs-command';
import { DataSourceOptions } from 'typeorm';

import { ConnectionNames } from '../constant/database.constant';

import { createDB } from '../utils';

@Injectable()
export class CreateDbSeed {
  constructor(private readonly configService: ConfigService) {}

  @Command({
    command: 'create:db',
    describe: 'create default db',
  })
  async create(): Promise<void> {
    try {
      if (this.configService.get<boolean>('database.autoCreateDB')) {
        await createDB(
          this.configService.get<DataSourceOptions>(
            `database.${ConnectionNames.Default}`,
          ),
        );
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  @Command({
    command: 'destroy:db',
    describe: 'destroy default db',
  })
  async remove(): Promise<void> {
    try {
      throw new Error('Not Implemented destroy:db');
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
