import { AbilityActionEnum, AbilityTypeEnum } from '@acp/ability';
import { AcpSubjectDict } from '@acp/subject';
import { EnumOrganizationRole } from '@acp/role';

export const rolePresetsSeedData = {
  roles: [
    {
      name: EnumOrganizationRole.Owner,
      policy: {
        sensitivityLevel: 9,
        subjects: [
          {
            sensitivityLevel: 9,
            type: AcpSubjectDict.Organization,
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
      name: EnumOrganizationRole.Admin,
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
      name: EnumOrganizationRole.Manager,
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
      name: EnumOrganizationRole.Observer,
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
