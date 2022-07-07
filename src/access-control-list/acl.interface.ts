import { Subject, Action } from '@avo/casl';

export interface IReqAclAbility {
  action: Action;
  subject: keyof typeof Subject;
}
