export class RedisServerService {
  private readonly server;

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
