import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { GroupQuestion } from '../entity';

export const ReqGroupQuestion = createParamDecorator(
  (key: string, ctx: ExecutionContext): GroupQuestion | null => {
    const { __groupQuestion } = ctx.switchToHttp().getRequest();
    return key ? __groupQuestion[key] : __groupQuestion;
  },
);
