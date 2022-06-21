import { AbilityActionEnum, AbilityTypeEnum } from '@acp/ability';
import { AcpSubjectDict } from '@acp/subject';
import { EnumSystemRole } from '@acp/role';

export const superSeedData = {
  organization: {
    name: 'system',
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
      name: EnumSystemRole.SuperAdmin,
      policy: {
        sensitivityLevel: 10,
        subjects: [
          {
            sensitivityLevel: 10,
            type: AcpSubjectDict.System,
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
      name: EnumSystemRole.SystemAdmin,
      policy: {
        sensitivityLevel: 9,
        subjects: [
          {
            sensitivityLevel: 10,
            type: AcpSubjectDict.System,
            abilities: [
              {
                type: AbilityTypeEnum.Can,
                actions: [AbilityActionEnum.Modify],
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
            type: AcpSubjectDict.Order,
            abilities: [
              {
                type: AbilityTypeEnum.Can,
                actions: [AbilityActionEnum.Manage],
              },
            ],
          },
          {
            sensitivityLevel: 5,
            type: AcpSubjectDict.System,
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
      name: EnumSystemRole.SystemReadOnly,
      policy: {
        sensitivityLevel: 5,
        subjects: [
          {
            sensitivityLevel: 10,
            type: AcpSubjectDict.System,
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
