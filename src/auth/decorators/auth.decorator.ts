import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { AuthUserLoginSerialization } from '../serialization';

export const ReqJwtUser = createParamDecorator(
  (key: string, ctx: ExecutionContext): AuthUserLoginSerialization => {
    const { user } = ctx.switchToHttp().getRequest();
    return key ? user[key] : user;
  },
);

export const Token = createParamDecorator(
  (_data: string, ctx: ExecutionContext): string => {
    const { headers } = ctx.switchToHttp().getRequest();
    const { authorization } = headers;
    return authorization ? authorization.split(' ')[1] : undefined;
  },
);
