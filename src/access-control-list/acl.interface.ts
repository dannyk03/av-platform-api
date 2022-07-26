import { Action, Subject } from '@avo/casl';

export interface IReqAclAbility {
  action: Action;
  subject: keyof typeof Subject;
}
