import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
// Services
import { DebuggerService } from '@/debugger/service';
//
import { ConnectionNames } from '../database.constant';
import { createDB } from '../utils';

@Injectable()
export class CreateDbSeed {
  constructor(
    private readonly configService: ConfigService,
    private readonly debuggerService: DebuggerService,
  ) {}

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

      this.debuggerService.debug(
        'Create default DB Succeed',
        'CreateDbSeed',
        'create',
      );
    } catch (err) {
      this.debuggerService.error(err.message, 'CreateDbSeed', 'create');
    }
  }

  @Command({
    command: 'destroy:db',
    describe: 'destroy default db',
  })
  async remove(): Promise<void> {
    try {
      throw new Error('Not Implemented destroy:db');
      this.debuggerService.debug(
        'Destroy default DB Succeed',
        'CreateDbSeed',
        'remove',
      );
    } catch (e) {
      this.debuggerService.error(e.message, 'CreateDbSeed', 'destroy');
    }
  }
}
