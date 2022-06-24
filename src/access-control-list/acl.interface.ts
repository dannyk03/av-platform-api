import { EnumAclAbilityAction } from './ability';
import { AclSubjectTypeDict } from './subject';

export interface IReqAclAbility {
  action: EnumAclAbilityAction;
  subject: keyof typeof AclSubjectTypeDict;
}
