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
    const { __user, params } = context.switchToHttp().getRequest();

    if (!__user && (params?.id || params?.groupId)) return false;

    const findGroup = await this.groupService.findGroup({
      userId: __user?.id,
      groupId: params?.id || params?.groupId,
    });

    if (!findGroup) {
      throw new NotFoundException({
        statusCode: EnumGroupStatusCodeError.GroupNotFoundError,
        message: 'group.error.notFound',
      });
    }

    return true;
  }
}
