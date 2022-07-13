export enum EnumRequestStatusCodeError {
  RequestValidationError = 5981,
  RequestTimestampInvalidError = 5982,
  RequestUserAgentInvalidError = 5983,
}

export enum EnumRequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS',
  HEAD = 'HEAD',
}

export const REQUEST_EXCLUDE_TIMESTAMP_META_KEY =
  'RequestExcludeTimestampMetaKey';
