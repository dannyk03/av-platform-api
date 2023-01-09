import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';

import { GroupQuestionGuard } from '@/group/guard';
import { GroupMemberGuard } from '@/group/guard/group-member.guard';

import { GROUP_QUESTION_OWNER } from '@/group/constant';

export function CanAccessGroupQuestion(
  { owner }: { owner: boolean } = { owner: false },
) {
  return applyDecorators(
    UseGuards(GroupMemberGuard, GroupQuestionGuard),
    SetMetadata(GROUP_QUESTION_OWNER, owner),
  );
}
