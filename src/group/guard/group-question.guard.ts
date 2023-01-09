import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { EnumGroupQuestionStatusCodeError } from '@avo/type';

import { GroupQuestionService } from '../service';

import { GROUP_QUESTION_OWNER } from '@/group/constant';

@Injectable()
export class GroupQuestionGuard implements CanActivate {
  constructor(
    private readonly groupQuestionService: GroupQuestionService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { __user, __group, params } = request;

    const id = params.questionId || params?.groupQuestionId || params.id;

    if (!__user || !__group) return false;

    const userIsOwner = this.reflector.getAllAndOverride<boolean>(
      GROUP_QUESTION_OWNER,
      [context.getHandler(), context.getClass()],
    );

    const findGroupQuestion = await this.groupQuestionService.findGroupQuestion(
      {
        userId: userIsOwner ? __user.id : null,
        groupId: __group?.id,
        groupQuestionId: id,
      },
    );

    if (!findGroupQuestion) {
      throw new NotFoundException({
        statusCode: EnumGroupQuestionStatusCodeError.GroupQuestionNotFoundError,
        message: 'group.question.error.notFound',
      });
    }

    request.__groupQuestion = findGroupQuestion;

    return true;
  }
}
