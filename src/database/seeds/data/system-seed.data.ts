import { EnumAclAbilityAction, EnumAclAbilityType } from '@acl/ability';
import { DeepPartial } from 'typeorm';
// Entities
import { User } from '@/user/entity/user.entity';
import { Organization } from '@/organization/entity';
import { AclRole } from '@/access-control-list/role/entity/acl-role.entity';
//
import { AclSubjectTypeDict } from '@acl/subject';
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
    emailVerified: true,
  },
  roles: [
    {
      name: EnumSystemRole.SystemAdmin,
      policy: {
        subjects: [
          {
            type: AclSubjectTypeDict.System,
            abilities: [
              {
                type: EnumAclAbilityType.Can,
                action: EnumAclAbilityAction.Manage,
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
            type: AclSubjectTypeDict.Order,
            abilities: [
              {
                type: EnumAclAbilityType.Can,
                action: EnumAclAbilityAction.Manage,
              },
            ],
          },
          {
            type: AclSubjectTypeDict.System,
            abilities: [
              {
                type: EnumAclAbilityType.Can,
                action: EnumAclAbilityAction.Read,
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
            type: AclSubjectTypeDict.System,
            abilities: [
              {
                type: EnumAclAbilityType.Can,
                action: EnumAclAbilityAction.Read,
              },
            ],
          },
        ],
      },
    },
  ],
};
