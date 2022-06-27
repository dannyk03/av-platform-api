import { EnumAclAbilityAction, EnumAclAbilityType } from '@acl/ability';
import { AclSubjectTypeDict } from '@acl/subject';
import { EnumOrganizationRole } from '@acl/role';

export const rolePresetsSeedData = {
  roles: [
    {
      name: EnumOrganizationRole.Owner,
      policy: {
        subjects: [
          {
            type: AclSubjectTypeDict.OrganizationNamespace,
            abilities: [
              {
                type: EnumAclAbilityType.Can,
                actions: [EnumAclAbilityAction.Manage],
              },
            ],
          },
          {
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
        subjects: [
          {
            type: AclSubjectTypeDict.OrganizationNamespace,
            abilities: [
              {
                type: EnumAclAbilityType.Can,
                actions: [EnumAclAbilityAction.Manage],
              },
            ],
          },
          {
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
        subjects: [
          {
            type: AclSubjectTypeDict.Order,
            abilities: [
              {
                type: EnumAclAbilityType.Can,
                actions: [EnumAclAbilityAction.Manage],
              },
            ],
          },
          {
            type: AclSubjectTypeDict.Gift,
            abilities: [
              {
                type: EnumAclAbilityType.Can,
                actions: [EnumAclAbilityAction.Manage],
              },
            ],
          },
          {
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
        subjects: [
          {
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
