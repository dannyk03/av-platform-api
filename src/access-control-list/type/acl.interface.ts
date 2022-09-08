import { Action, Subjects } from '@avo/casl';

export interface IReqAclAbility {
  action: Action;
  subject: keyof typeof Subjects;
}
