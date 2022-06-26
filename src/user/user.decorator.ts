import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './entity/user.entity';

export const ReqUser = createParamDecorator(
  (data: string, ctx: ExecutionContext): User => {
    const { __user } = ctx.switchToHttp().getRequest();
    return __user;
  },
);
