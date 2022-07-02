export enum EnumOrganizationStatusCodeError {
  OrganizationNotFoundError = 5450,
  OrganizationExistsError = 5451,
  OrganizationOwnerExistsError = 5452,
  OrganizationInactiveError = 5453,
  OrganizationSystemOnlyError = 5454,
  OrganizationUserAlreadyInvited = 5455,
  OrganizationInviteNotFoundError = 5456,
  OrganizationInviteExpiredError = 5457,
  OrganizationInviteUsedError = 5458,
}

export const ORGANIZATION_ACTIVE_META_KEY = 'OrganizationActiveMetaKey';
