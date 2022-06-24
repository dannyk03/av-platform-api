export enum EnumAuthStatusCodeError {
  AuthGuardBasicTokenNeededError = 5100,
  AuthGuardBasicTokenInvalidError = 5101,
  AuthGuardJwtAccessTokenError = 5102,
  AuthGuardJwtRefreshTokenError = 5103,
  AuthGuardInactiveError = 5104,
  AuthGuardRoleInactiveError = 5105,
  AuthGuardOrganizationInactiveError = 5106,
  AuthGuardPasswordExpiredError = 5107,
  AuthPasswordNotMatchError = 5108,
  AuthPasswordNewMustDifferenceError = 5109,
  AuthPasswordExpiredError = 5110,
}
