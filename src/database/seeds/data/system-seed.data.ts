import { EnumAclAbilityAction, EnumAclAbilityType } from '@acl/ability';
import { AclSubjectTypeDict } from '@acl/subject';
import { EnumSystemRole } from '@acl/role';
import { SYSTEM_ORGANIZATION_NAME } from '@/system';

export const systemSeedData = {
  organization: {
    name: SYSTEM_ORGANIZATION_NAME,
  },
  systemAdmin: {
    firstName: 'SystemAdmin',
    isActive: true,
    emailVerified: true,
    emailVerificationToken: 'SystemAdmin',
  },
  roles: [
    {
      name: EnumSystemRole.SystemAdmin,
      policy: {
        sensitivityLevel: 10,
        subjects: [
          {
            sensitivityLevel: 10,
            type: AclSubjectTypeDict.System,
            abilities: [
              {
                type: EnumAclAbilityType.Can,
                actions: [EnumAclAbilityAction.Manage],
              },
            ],
          },
        ],
      },
    },
    {
      name: EnumSystemRole.SystemManager,
      policy: {
        sensitivityLevel: 5,
        subjects: [
          {
            sensitivityLevel: 5,
            type: AclSubjectTypeDict.Order,
            abilities: [
              {
                type: EnumAclAbilityType.Can,
                actions: [EnumAclAbilityAction.Manage],
              },
            ],
          },
          {
            sensitivityLevel: 5,
            type: AclSubjectTypeDict.System,
            abilities: [
              {
                type: EnumAclAbilityType.Can,
                actions: [EnumAclAbilityAction.Read],
              },
            ],
          },
        ],
      },
    },
    {
      name: EnumSystemRole.SystemObserver,
      policy: {
        sensitivityLevel: 5,
        subjects: [
          {
            sensitivityLevel: 10,
            type: AclSubjectTypeDict.System,
            abilities: [
              {
                type: EnumAclAbilityType.Can,
                actions: [EnumAclAbilityAction.Read],
              },
            ],
          },
        ],
      },
    },
  ],
};
