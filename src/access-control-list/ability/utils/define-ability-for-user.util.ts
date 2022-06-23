import { defineAbility, createAliasResolver } from '@casl/ability';
import { AbilityActionEnum } from '../acl-ability.constant';

const resolveAction = createAliasResolver({
  [AbilityActionEnum.Modify]: [
    AbilityActionEnum.Update,
    AbilityActionEnum.Create,
    AbilityActionEnum.Read,
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
