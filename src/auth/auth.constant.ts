export enum EnumAuthStatusCodeError {
  AuthGuardBasicTokenNeededError = 5100,
  AuthGuardBasicTokenInvalidError = 5101,
  AuthGuardJwtAccessTokenError = 5102,
  AuthGuardJwtRefreshTokenError = 5103,
  AuthGuardInactiveError = 5104,
  AuthGuardRoleInactiveError = 5105,
  AuthGuardAdminError = 5106,
  AuthGuardPasswordExpiredError = 5107,
  AuthPasswordNotMatchError = 5108,
  AuthPasswordNewMustDifferenceError = 5109,
  AuthPasswordExpiredError = 5110,

  AuthGuardApiKeyNeededError = 5121,
  AuthGuardApiKeyPrefixInvalidError = 5122,
  AuthGuardApiKeySchemaInvalidError = 5123,
  AuthGuardApiKeyTimestampNotMatchWithRequestError = 5124,
  AuthGuardApiKeyNotFoundError = 5125,
  AuthGuardApiKeyInactiveError = 5126,
  AuthGuardApiKeyInvalidError = 5127,
}

export const AUTH_ADMIN_META_KEY = 'AuthAdminMetaKey';
