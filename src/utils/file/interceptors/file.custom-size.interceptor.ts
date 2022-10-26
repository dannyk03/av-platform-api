import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';

import { Observable } from 'rxjs';

import { FILE_CUSTOM_SIZE_META_KEY } from '../constants';

@Injectable()
export class FileCustomSizeInterceptor implements NestInterceptor<any> {
  constructor(private readonly reflector: Reflector) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<void>> {
    if (context.getType() === 'http') {
      const ctx: HttpArgumentsHost = context.switchToHttp();
      const request = ctx.getRequest();

      const customSize: string = this.reflector.get<string>(
        FILE_CUSTOM_SIZE_META_KEY,
        context.getHandler(),
      );
      request.__customFileSize = customSize;

      return next.handle();
    }

    return next.handle();
  }
}
