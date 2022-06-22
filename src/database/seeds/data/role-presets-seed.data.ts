import { AbilityActionEnum, AbilityTypeEnum } from '@acp/ability';
import { AcpSubjectTypeDict } from '@acp/subject';
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
            type: AcpSubjectTypeDict.Organization,
            abilities: [
              {
                type: AbilityTypeEnum.Can,
                actions: [AbilityActionEnum.Manage],
              },
              {
                type: AbilityTypeEnum.Cannot,
                actions: [AbilityActionEnum.Create],
              },
              {
                type: AbilityTypeEnum.Cannot,
                actions: [AbilityActionEnum.Delete],
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
            type: AcpSubjectTypeDict.User,
            abilities: [
              {
                type: AbilityTypeEnum.Can,
                actions: [AbilityActionEnum.Manage],
              },
            ],
          },
          {
            sensitivityLevel: 10,
            type: AcpSubjectTypeDict.FinanceNamespace,
            abilities: [
              {
                type: AbilityTypeEnum.Can,
                actions: [AbilityActionEnum.Manage],
              },
            ],
          },
          {
            sensitivityLevel: 10,
            type: AcpSubjectTypeDict.SecurityNamespace,
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
      name: EnumOrganizationRole.Manager,
      policy: {
        sensitivityLevel: 5,
        subjects: [
          {
            sensitivityLevel: 5,
            type: AcpSubjectTypeDict.Order,
            abilities: [
              {
                type: AbilityTypeEnum.Can,
                actions: [AbilityActionEnum.Manage],
              },
            ],
          },
          {
            sensitivityLevel: 5,
            type: AcpSubjectTypeDict.Gift,
            abilities: [
              {
                type: AbilityTypeEnum.Can,
                actions: [AbilityActionEnum.Manage],
              },
            ],
          },
          {
            sensitivityLevel: 5,
            type: AcpSubjectTypeDict.Organization,
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
            type: AcpSubjectTypeDict.Organization,
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
