import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';

// import { RedisMemoryServer } from 'redis-memory-server';

export class RedisServerService implements OnModuleInit, OnModuleDestroy {
  private readonly server;
  // private readonly server = new RedisMemoryServer({
  //   autoStart: true,
  //   instance: {
  //     port: parseInt(process.env.REDIS_PORT),
  //     ip: process.env.REDIS_HOST,
  //   },
  // });
  async onModuleInit() {
    //   console.log(
    //     `Redis server running on ${await this.server.getHost()}:${await this.server.getPort()}`,
    //   );
  }
  async onModuleDestroy() {
    //   try {
    //     await this.server.stop();
    //     console.log(`The local Redis server is off`);
    //   } catch (error) {
    //     console.error(error);
    //   }
  }
  async getPort(): Promise<number | undefined> {
    return this.server?.getPort();
  }
  async getHost(): Promise<string | undefined> {
    return this.server?.getHost();
  }
  async stop(): Promise<boolean> {
    return this.server?.stop();
  }
}
