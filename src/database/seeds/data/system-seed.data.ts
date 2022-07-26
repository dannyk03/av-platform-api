import { AbilityVerb, Action, Subject } from '@avo/casl';
import { DeepPartial } from 'typeorm';
// Entities
import { AclRole } from '$/access-control-list/role/entity';
import { Organization } from '$/organization/entity';
import { User } from '$/user/entity';
//
import { SYSTEM_ORGANIZATION_NAME } from '$/system';
import { EnumSystemRole } from '$acl/role';

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
            type: Subject.System,
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
            type: Subject.Order,
            abilities: [
              {
                type: AbilityVerb.Can,
                action: Action.Manage,
              },
            ],
          },
          {
            type: Subject.System,
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
            type: Subject.System,
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
