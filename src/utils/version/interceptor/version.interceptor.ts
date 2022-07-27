import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Observable } from 'rxjs';

@Injectable()
export class VersionInterceptor implements NestInterceptor<Promise<any>> {
  constructor(private readonly configService: ConfigService) {}

  async intercept(
    ctx: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Promise<any> | string>> {
    const request = ctx.switchToHttp().getRequest();

    const globalPrefix: boolean =
      this.configService.get<boolean>('app.globalPrefix');
    const versioning: boolean =
      this.configService.get<boolean>('app.versioning.on');
    const versioningPrefix: string = this.configService.get<string>(
      'app.versioning.prefix',
    );
    const originalUrl: string = request.url;

    if (
      versioning &&
      originalUrl.startsWith(`${globalPrefix}/${versioningPrefix}`)
    ) {
      const url: string[] = originalUrl.split('/');
      const version: number = Number.parseInt(
        url[2].replace(versioningPrefix, ''),
      );

      request.version = version;
    }

    return next.handle();
  }
}
