import { defineAbility, createAliasResolver } from '@casl/ability';
import { EnumAclAbilityAction } from '../acl-ability.constant';

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

export const defineAbilityForUser = (user, acl) =>
  defineAbility(
    (can) => {
      can('read', 'Article');

      if (user.isLoggedIn) {
        can('update', 'Article', { authorId: user.id });
        can('create', 'Comment');
        can('update', 'Comment', { authorId: user.id });
      }
    },
    { resolveAction },
  );
