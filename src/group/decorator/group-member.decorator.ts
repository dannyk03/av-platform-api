import { UseGuards, applyDecorators } from '@nestjs/common';

import { GroupMemberGuard } from '../guard';

export function CanAccessAsGroupMember() {
  return applyDecorators(UseGuards(GroupMemberGuard));
}
