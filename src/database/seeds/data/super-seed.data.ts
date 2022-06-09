import { AbilityActionEnum, AbilityTypeEnum } from '@acp/ability';
import { SystemRoleEnum } from '@acp/role';

export const systemSeedData = {
  organization: {
    name: 'system',
  },
  roles: {
    [SystemRoleEnum.SuperAdmin]: {
      name: SystemRoleEnum.SuperAdmin,
      policies: [
        {
          sensitivityLevel: 10,
          subjects: [
            {
              sensitivityLevel: 10,
              abilities: {
                type: AbilityTypeEnum.Can,
                action: AbilityActionEnum.Manage,
              },
            },
          ],
        },
      ],
    },
    [SystemRoleEnum.SystemAdmin]: {},
    [SystemRoleEnum.SystemManager]: {},
    [SystemRoleEnum.SystemReadOnly]: {},
  },
  owner: {
    firstName: 'Avo',
    lastName: 'SuperAdmin',
    email: 'superadmin@avonow.com',
    passwordExpired: new Date().setFullYear(3333),
    isActive: true,
    emailVerified: true,
    emailVerificationToken: 'superadmin',
  },
};
