import { Injectable } from '@nestjs/common';

import { Command } from 'nestjs-command';

import { RolePresetsSeedService } from './seed/service';

@Injectable()
export class RolePresetsSeed {
  constructor(
    private readonly rolePresetsSeedService: RolePresetsSeedService,
  ) {}

  @Command({
    command: 'insert:role-presets',
    describe: 'insert role presets data',
  })
  async insert(): Promise<void> {
    await this.rolePresetsSeedService.insert();
  }

  @Command({
    command: 'remove:role-presets',
    describe: 'remove role presets data',
  })
  async remove(): Promise<void> {
    throw new Error('Not Implemented remove:role-presets');
  }
}
