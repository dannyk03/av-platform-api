import { Action, AbilityVerb, Subject } from '@avo/casl';
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
            type: Subject.OrganizationNamespace,
            abilities: [
              {
                type: AbilityVerb.Can,
                action: Action.Manage,
              },
            ],
          },
          {
            type: Subject.Organization,
            abilities: [
              {
                type: AbilityVerb.Cannot,
                action: Action.Create,
              },
              {
                type: AbilityVerb.Cannot,
                action: Action.Delete,
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
            type: Subject.OrganizationNamespace,
            abilities: [
              {
                type: AbilityVerb.Can,
                action: Action.Manage,
              },
            ],
          },
          {
            type: Subject.Organization,
            abilities: [
              {
                type: AbilityVerb.Cannot,
                action: Action.Manage,
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
            type: Subject.Order,
            abilities: [
              {
                type: AbilityVerb.Can,
                action: Action.Manage,
              },
            ],
          },
          {
            type: Subject.Gift,
            abilities: [
              {
                type: AbilityVerb.Can,
                action: Action.Manage,
              },
            ],
          },
          {
            type: Subject.Organization,
            abilities: [
              {
                type: AbilityVerb.Can,
                action: Action.Read,
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
            type: Subject.OrganizationNamespace,
            abilities: [
              {
                type: AbilityVerb.Can,
                action: Action.Read,
              },
            ],
          },
        ],
      },
    },
  ],
};
