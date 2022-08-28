import { AbilityVerb, Action, Subjects } from '@avo/casl';

import { EnumSystemRole } from '@acl/role';
import { DeepPartial } from 'typeorm';

import { AclRole } from '@/access-control-list/role/entity';
import { Organization } from '@/organization/entity';
import { User } from '@/user/entity';

import { SYSTEM_ORGANIZATION_NAME } from '@/system';

export const systemSeedData: {
  systemAdmin: DeepPartial<User>;
  roles: DeepPartial<AclRole>[];
  organization: DeepPartial<Organization>;
} = {
  organization: {
    name: SYSTEM_ORGANIZATION_NAME,
  },
  systemAdmin: {
    profile: {
      firstName: 'SystemAdmin',
      title: 'God',
    },
  },
  roles: [
    {
      name: EnumSystemRole.SystemAdmin,
      policy: {
        subjects: [
          {
            type: Subjects.System,
            abilities: [
              {
                type: AbilityVerb.Can,
                action: Action.Manage,
              },
            ],
          },
        ],
      },
    },
    {
      name: EnumSystemRole.SystemManager,
      policy: {
        subjects: [
          {
            type: Subjects.Order,
            abilities: [
              {
                type: AbilityVerb.Can,
                action: Action.Manage,
              },
            ],
          },
          {
            type: Subjects.GiftingNamespace,
            abilities: [
              {
                type: AbilityVerb.Can,
                action: Action.Manage,
              },
            ],
          },
          {
            type: Subjects.CatalogNamespace,
            abilities: [
              {
                type: AbilityVerb.Can,
                action: Action.Manage,
              },
            ],
          },
          {
            type: Subjects.System,
            abilities: [
              {
                type: AbilityVerb.Can,
                action: Action.Read,
              },
            ],
          },
        ],
      },
    },
    {
      name: EnumSystemRole.SystemObserver,
      policy: {
        subjects: [
          {
            type: Subjects.System,
            abilities: [
              {
                type: AbilityVerb.Can,
                action: Action.Read,
              },
            ],
          },
        ],
      },
    },
  ],
};
