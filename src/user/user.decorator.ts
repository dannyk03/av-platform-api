import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetReqUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const { __user } = ctx.switchToHttp().getRequest();
    return __user;
  },
);
