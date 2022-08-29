export enum EnumLogLevel {
  Debug = 'DEBUG',
  Info = 'INFO',
  Warn = 'WARN',
  Error = 'ERROR',
  Fatal = 'FATAL',
}

export enum EnumLogAction {
  Test = 'TEST',
  Login = 'LOGIN',
  SignupLoginMagic = 'SIGNUP_LOGIN_MAGIC',
  SignUp = 'SIGNUP',
  CreateOrganization = 'CREATE_ORGANIZATION',
  CreatePayment = 'CREATE_PAYMENT',

  SendConnectionRequest = 'SEND_CONNECTION_REQUEST',
  ApproveConnectionRequest = 'APPROVE_CONNECTION_REQUEST',
  RejectConnectionRequest = 'REJECT_CONNECTION_REQUEST',
  BlockConnectionRequest = 'BLOCK_CONNECTION_REQUEST',

  CatalogProductCreate = 'CATALOG_PRODUCT_CREATE',
  CatalogProductUpdate = 'CATALOG_PRODUCT_UPDATE',
  CatalogProductDelete = 'CATALOG_PRODUCT_DELETE',
  CatalogProductActive = 'CATALOG_PRODUCT_ACTIVE',
  CatalogProductInactive = 'CATALOG_PRODUCT_INACTIVE',

  GiftSend = 'GIFT_SEND',
  GiftSubmit = 'GIFT_SUBMIT',
  GiftConfirmMagic = 'GIFT_CONFIRM',
  GiftReadyMagic = 'GIFT_READY',
  GiftStatusUpdate = 'GIFT_STATUS_UPDATE',
  GiftAddOption = 'ADD_GIFT_OPTION',
  GiftUpdateOption = 'UPDATE_GIFT_OPTION',
  GiftDeleteOption = 'DELETE_GIFT_OPTION',
  GiftUpsertOption = 'UPSERT_GIFT_OPTION',

  OrganizationJoinMagic = 'ORG_JOIN_MAGIC',
}
