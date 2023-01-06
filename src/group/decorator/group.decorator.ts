import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { Group } from '../entity';

export const ReqGroup = createParamDecorator(
  (key: string, ctx: ExecutionContext): Group | null => {
    const { __group } = ctx.switchToHttp().getRequest();
    return key ? __group[key] : __group;
  },
);
