import { AbilityActionEnum, AbilityTypeEnum } from '@acl/ability';
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
                type: AbilityTypeEnum.Can,
                actions: [AbilityActionEnum.Manage],
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
                type: AbilityTypeEnum.Can,
                actions: [AbilityActionEnum.Manage],
              },
            ],
          },
          {
            sensitivityLevel: 5,
            type: AclSubjectTypeDict.System,
            abilities: [
              {
                type: AbilityTypeEnum.Can,
                actions: [AbilityActionEnum.Read],
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
                type: AbilityTypeEnum.Can,
                actions: [AbilityActionEnum.Read],
              },
            ],
          },
        ],
      },
    },
  ],
};
