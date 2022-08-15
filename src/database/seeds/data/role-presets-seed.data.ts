import { AbilityVerb, Action, Subjects } from '@avo/casl';

import { EnumOrganizationRole } from '@acl/role';
import { DeepPartial } from 'typeorm';

import { AclRole } from '@/access-control-list/role/entity';

export const rolePresetsSeedData: { roles: DeepPartial<AclRole>[] } = {
  roles: [
    {
      name: EnumOrganizationRole.Owner,
      policy: {
        subjects: [
          {
            type: Subjects.OrganizationNamespace,
            abilities: [
              {
                type: AbilityVerb.Can,
                action: Action.Manage,
              },
            ],
          },
          {
            type: Subjects.Organization,
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
            type: Subjects.OrganizationNamespace,
            abilities: [
              {
                type: AbilityVerb.Can,
                action: Action.Manage,
              },
            ],
          },
          {
            type: Subjects.Organization,
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
            type: Subjects.Order,
            abilities: [
              {
                type: AbilityVerb.Can,
                action: Action.Manage,
              },
            ],
          },
          {
            type: Subjects.GiftingNamespace,
            abilities: [
              {
                type: AbilityVerb.Can,
                action: Action.Manage,
              },
            ],
          },
          {
            type: Subjects.Organization,
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
            type: Subjects.OrganizationNamespace,
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
      name: EnumOrganizationRole.User,
      policy: {
        subjects: [],
      },
    },
  ],
};
