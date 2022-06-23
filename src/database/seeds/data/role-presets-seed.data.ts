import { AbilityActionEnum, AbilityTypeEnum } from '@acl/ability';
import { AclSubjectTypeDict } from '@acl/subject';
import { EnumOrganizationRole } from '@acl/role';

export const rolePresetsSeedData = {
  roles: [
    {
      name: EnumOrganizationRole.Owner,
      policy: {
        sensitivityLevel: 9,
        subjects: [
          {
            sensitivityLevel: 9,
            type: AclSubjectTypeDict.OrganizationNamespace,
            abilities: [
              {
                type: AbilityTypeEnum.Can,
                actions: [AbilityActionEnum.Manage],
              },
            ],
          },
          {
            sensitivityLevel: 9,
            type: AclSubjectTypeDict.Organization,
            abilities: [
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
            sensitivityLevel: 8,
            type: AclSubjectTypeDict.OrganizationNamespace,
            abilities: [
              {
                type: AbilityTypeEnum.Can,
                actions: [AbilityActionEnum.Manage],
              },
            ],
          },
          {
            sensitivityLevel: 9,
            type: AclSubjectTypeDict.Organization,
            abilities: [
              {
                type: AbilityTypeEnum.Cannot,
                actions: [AbilityActionEnum.Manage],
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
            type: AclSubjectTypeDict.Gift,
            abilities: [
              {
                type: AbilityTypeEnum.Can,
                actions: [AbilityActionEnum.Manage],
              },
            ],
          },
          {
            sensitivityLevel: 5,
            type: AclSubjectTypeDict.Organization,
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
            sensitivityLevel: 9,
            type: AclSubjectTypeDict.OrganizationNamespace,
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
