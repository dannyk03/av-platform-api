import { EnumAclAbilityAction, EnumAclAbilityType } from '@acl/ability';
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
                type: EnumAclAbilityType.Can,
                actions: [EnumAclAbilityAction.Manage],
              },
            ],
          },
          {
            sensitivityLevel: 9,
            type: AclSubjectTypeDict.Organization,
            abilities: [
              {
                type: EnumAclAbilityType.Cannot,
                actions: [EnumAclAbilityAction.Create],
              },
              {
                type: EnumAclAbilityType.Cannot,
                actions: [EnumAclAbilityAction.Delete],
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
                type: EnumAclAbilityType.Can,
                actions: [EnumAclAbilityAction.Manage],
              },
            ],
          },
          {
            sensitivityLevel: 9,
            type: AclSubjectTypeDict.Organization,
            abilities: [
              {
                type: EnumAclAbilityType.Cannot,
                actions: [EnumAclAbilityAction.Manage],
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
                type: EnumAclAbilityType.Can,
                actions: [EnumAclAbilityAction.Manage],
              },
            ],
          },
          {
            sensitivityLevel: 5,
            type: AclSubjectTypeDict.Gift,
            abilities: [
              {
                type: EnumAclAbilityType.Can,
                actions: [EnumAclAbilityAction.Manage],
              },
            ],
          },
          {
            sensitivityLevel: 5,
            type: AclSubjectTypeDict.Organization,
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
      name: EnumOrganizationRole.Observer,
      policy: {
        sensitivityLevel: 5,
        subjects: [
          {
            sensitivityLevel: 9,
            type: AclSubjectTypeDict.OrganizationNamespace,
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
