import { defineAbility, createAliasResolver } from '@casl/ability';
import { AbilityActionEnum } from '../acp-ability.constant';

const resolveAction = createAliasResolver({
  [AbilityActionEnum.Modify]: [
    AbilityActionEnum.Update,
    AbilityActionEnum.Delete,
    AbilityActionEnum.Read,
  ],
  // [AbilityActionEnum.ACCESS]: [
  //   AbilityActionEnum.READ,
  //   AbilityActionEnum.MODIFY,
  // ],
});

export const defineAbilityForUser = (user, acp) =>
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
