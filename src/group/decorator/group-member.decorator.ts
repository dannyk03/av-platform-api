import { UseGuards, applyDecorators } from '@nestjs/common';

import { GroupMemberGuard } from '../guard';

export function CanAccessGroupAsGroupMember() {
  return applyDecorators(UseGuards(GroupMemberGuard));
}
