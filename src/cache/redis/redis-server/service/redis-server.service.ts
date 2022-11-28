import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';

import { RedisMemoryServer } from 'redis-memory-server';

export class RedisServerService implements OnModuleInit, OnModuleDestroy {
  private readonly server = new RedisMemoryServer({
    autoStart: true,
  });

  async onModuleInit() {
    console.log(
      `Redis server running on ${await this.server.getHost()}:${await this.server.getPort()}`,
    );
  }

  async onModuleDestroy() {
    try {
      await this.server.stop();
      console.log(`The local Redis server is off`);
    } catch (error) {
      console.error(error);
    }
  }

  async getPort(): Promise<number> {
    return this.server.getPort();
  }

  async getHost(): Promise<string> {
    return this.server.getHost();
  }
}
