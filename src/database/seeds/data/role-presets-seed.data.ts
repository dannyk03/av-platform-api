import { EnumAclAbilityAction, EnumAclAbilityType } from '@acl/ability';
import { AclSubjectTypeDict } from '@acl/subject';
import { EnumOrganizationRole } from '@acl/role';
import { AclRole } from '@/access-control-list/role/entity/acl-role.entity';
import { DeepPartial } from 'typeorm';

export const rolePresetsSeedData: { roles: DeepPartial<AclRole>[] } = {
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
                action: EnumAclAbilityAction.Manage,
              },
            ],
          },
          {
            type: AclSubjectTypeDict.Organization,
            abilities: [
              {
                type: EnumAclAbilityType.Cannot,
                action: EnumAclAbilityAction.Create,
              },
              {
                type: EnumAclAbilityType.Cannot,
                action: EnumAclAbilityAction.Delete,
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
                action: EnumAclAbilityAction.Manage,
              },
            ],
          },
          {
            type: AclSubjectTypeDict.Organization,
            abilities: [
              {
                type: EnumAclAbilityType.Cannot,
                action: EnumAclAbilityAction.Manage,
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
                action: EnumAclAbilityAction.Manage,
              },
            ],
          },
          {
            type: AclSubjectTypeDict.Gift,
            abilities: [
              {
                type: EnumAclAbilityType.Can,
                action: EnumAclAbilityAction.Manage,
              },
            ],
          },
          {
            type: AclSubjectTypeDict.Organization,
            abilities: [
              {
                type: EnumAclAbilityType.Can,
                action: EnumAclAbilityAction.Read,
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
                action: EnumAclAbilityAction.Read,
              },
            ],
          },
        ],
      },
    },
  ],
};
