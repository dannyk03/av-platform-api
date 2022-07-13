import { DeepPartial } from 'typeorm';
import { Action, AbilityVerb, Subject } from '@avo/casl';
// Entities
import { User } from '@/user/entity';
import { Organization } from '@/organization/entity';
import { AclRole } from '@/access-control-list/role/entity/acl-role.entity';
//
import { EnumSystemRole } from '@acl/role';
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
    firstName: 'SystemAdmin',
    isActive: true,
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
