import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { EXEC_META_CLASS_KEY, EXEC_META_FUNCTION_KEY } from '../constant';

@Injectable()
export class ExecMetaGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const cls = this.reflector.get<string>(
      EXEC_META_CLASS_KEY,
      context.getHandler(),
    );
    const func = this.reflector.get<string>(
      EXEC_META_FUNCTION_KEY,
      context.getHandler(),
    );

    const className = context.getClass().name;
    const methodKey = context.getHandler().name;

    request.__class = cls || className;
    request.__function = func || methodKey;

    return true;
  }
}
