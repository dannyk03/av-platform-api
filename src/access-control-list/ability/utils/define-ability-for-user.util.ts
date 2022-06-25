import { User } from '@/user/entity/user.entity';
import { AclSubjectDict, AclSubjectTypeDict } from '@acl/subject';
import { AclSubject } from '@acl/subject/entity/acl-subject.entity';
import { defineAbility, createAliasResolver } from '@casl/ability';
import {
  EnumAclAbilityAction,
  EnumAclAbilityType,
} from '../acl-ability.constant';

const resolveAction = createAliasResolver({
  [EnumAclAbilityAction.Modify]: [
    EnumAclAbilityAction.Update,
    EnumAclAbilityAction.Create,
    EnumAclAbilityAction.Read,
  ],
  // [AbilityActionEnum.Access]: [
  //   AbilityActionEnum.READ,
  //   AbilityActionEnum.MODIFY,
  // ],
});

export const defineAbilities = (aclSubjects: AclSubject[]) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (user: User) =>
    defineAbility(
      (can, cannot) => {
        aclSubjects.forEach((subject) => {
          const { type: subjectType, abilities } = subject;

          abilities.forEach((ability) => {
            const { type: abilityType, actions } = ability;
            const subject =
              subjectType === AclSubjectTypeDict.System
                ? 'all'
                : AclSubjectDict[subjectType];
            if (abilityType === EnumAclAbilityType.Can) {
              can(actions, subject);
            } else if (abilityType === EnumAclAbilityType.Cannot) {
              cannot(actions, subject);
            }
          });
        });
      },
      { resolveAction },
    );
};
