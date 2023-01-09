import { IPaginationOptions } from '@/utils/pagination';

export interface IGroupQuestionAnswerSearch {
  groupId: string;
  groupQuestionId: string;
  userId?: string;
  options?: IPaginationOptions;
}
