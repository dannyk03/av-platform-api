import { GroupMember, GroupQuestion } from '@/group/entity';

import { IPaginationOptions } from '@/utils/pagination';

export interface IGroupQuestionSearch {
  groupId: string;
  options?: IPaginationOptions;
}

export interface GroupQuestionCreateJobPayload {
  groupQuestion: GroupQuestion;
  member: GroupMember;
}
