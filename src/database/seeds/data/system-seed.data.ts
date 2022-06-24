import { EnumAclAbilityAction, EnumAclAbilityType } from '@acl/ability';
import { AclSubjectTypeDict } from '@acl/subject';
import { EnumSystemRole } from '@acl/role';

export const systemSeedData = {
  organization: {
    name: 'System',
  },
  superAdmin: {
    firstName: 'Avo',
    lastName: 'SuperAdmin',
    email: 'superadmin@avonow.com',
    isActive: true,
    emailVerified: true,
    emailVerificationToken: 'superadmin',
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
