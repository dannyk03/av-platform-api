import { Injectable } from '@nestjs/common';

import { Command } from 'nestjs-command';

import { SystemSeedService } from './service';

@Injectable()
export class SystemSeed {
  constructor(private readonly systemSeedService: SystemSeedService) {}

  @Command({
    command: 'insert:system',
    describe: 'insert system data',
  })
  async insert(): Promise<void> {
    await this.systemSeedService.insert();
  }

  @Command({
    command: 'remove:system',
    describe: 'remove system data',
  })
  async remove(): Promise<void> {
    throw new Error('Not Implemented remove:system');
  }
}
