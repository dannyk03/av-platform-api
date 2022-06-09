import { AbilityActionEnum, AbilityTypeEnum } from '@acp/ability';
import { AcpSubjectDict } from '@acp/subject';
import { SystemRoleEnum } from '@acp/role';

export const superSeedData = {
  organization: {
    name: 'system',
  },
  owner: {
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
      policies: [
        {
          sensitivityLevel: 10,
          subjects: [
            {
              sensitivityLevel: 10,
              type: AcpSubjectDict.System,
              abilities: [
                {
                  type: AbilityTypeEnum.Can,
                  action: AbilityActionEnum.Manage,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: SystemRoleEnum.SystemAdmin,
      policies: [
        {
          sensitivityLevel: 9,
          subjects: [
            {
              sensitivityLevel: 10,
              type: AcpSubjectDict.System,
              abilities: [
                {
                  type: AbilityTypeEnum.Can,
                  action: AbilityActionEnum.Modify,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: SystemRoleEnum.SystemManager,
      policies: [
        {
          sensitivityLevel: 5,
          subjects: [
            {
              sensitivityLevel: 5,
              type: AcpSubjectDict.Order,
              abilities: [
                {
                  type: AbilityTypeEnum.Can,
                  action: AbilityActionEnum.Manage,
                },
              ],
            },
            {
              sensitivityLevel: 5,
              type: AcpSubjectDict.System,
              abilities: [
                {
                  type: AbilityTypeEnum.Can,
                  action: AbilityActionEnum.Read,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: SystemRoleEnum.SystemReadOnly,
      policies: [
        {
          sensitivityLevel: 5,
          subjects: [
            {
              sensitivityLevel: 10,
              type: AcpSubjectDict.System,
              abilities: {
                type: AbilityTypeEnum.Can,
                action: AbilityActionEnum.Read,
              },
            },
          ],
        },
      ],
    },
  ],
};
