import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { EnumGroupStatusCodeError } from '@avo/type';

import { GroupService } from '../service';

@Injectable()
export class GroupMemberGuard implements CanActivate {
  constructor(private readonly groupService: GroupService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { __user, params } = request;

    const groupId = params?.groupId || params.id;

    if (!__user && groupId) return false;

    const findGroup = await this.groupService.findGroup({
      userId: __user?.id,
      groupId,
    });

    if (!findGroup) {
      throw new NotFoundException({
        statusCode: EnumGroupStatusCodeError.GroupNotFoundError,
        message: 'group.error.notFound',
      });
    }

    request.__group = findGroup;

    return true;
  }
}
