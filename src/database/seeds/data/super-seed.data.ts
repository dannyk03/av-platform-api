import {
  AbilityActionEnum,
  AbilityTypeEnum,
} from '@/access-control-policy/ability';
import { AcpSubjectDict } from '@/access-control-policy/subject';
import { SystemRoleEnum } from '@/access-control-policy/role';

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
      name: SystemRoleEnum.SuperAdmin,
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
      name: SystemRoleEnum.SystemAdmin,
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
      name: SystemRoleEnum.SystemManager,
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
      name: SystemRoleEnum.SystemReadOnly,
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
