import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { User } from './entity';

export const ReqUser = createParamDecorator(
  (key: string, ctx: ExecutionContext): User | null => {
    const { __user } = ctx.switchToHttp().getRequest();
    return key ? __user[key] : __user;
  },
);
