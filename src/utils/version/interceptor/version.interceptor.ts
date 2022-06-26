import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';

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

      request.__version = version;
    }

    return next.handle();
  }
}
