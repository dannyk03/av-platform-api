import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './entity';

export const ReqUser = createParamDecorator(
  (key: string, ctx: ExecutionContext): User => {
    const { __user } = ctx.switchToHttp().getRequest();
    return key ? __user[key] : __user;
  },
);
