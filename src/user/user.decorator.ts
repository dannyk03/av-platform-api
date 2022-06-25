import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './entity/user.entity';

export const GetReqUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const { __user } = ctx.switchToHttp().getRequest();
    return __user as User;
  },
);
