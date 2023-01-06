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
  ResetPassword = 'RESET_PASSWORD',
  Refresh = 'REFRESH',
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

  UserProfileRequest = 'USER_PROFILE_REQUEST',
  UserDelete = 'USER_DELETE',
  UserActive = 'USER_ACTIVE',
  UserInactive = 'USER_INACTIVE',
  // Cloudinary
  CloudinaryWebhook = 'CLOUDINARY_WEBHOOK',
  CloudinaryWebhookError = 'CLOUDINARY_WEBHOOK_ERROR',
  // Stripe
  StripeWebhook = 'STRIPE_WEBHOOK',
  // OTP
  OtpSmsRequest = 'OTP_SMS_REQUEST',
  OtpSmsVerify = 'OTP_SMS_VERIFY',
  // Group
  CreateGroup = 'CREATE_GROUP',
  UpdateGroup = 'UPDATE_GROUP',
  DeleteGroup = 'DELETE_GROUP',
  GroupInviteAccept = 'GROUP_INVITE_ACCEPT',
  GroupInviteReject = 'GROUP_INVITE_REJECT',
  GroupInviteCancel = 'GROUP_INVITE_CANCEL',
  GroupInviteSend = 'GROUP_INVITE_SEND',
  GroupInviteResend = 'GROUP_INVITE_RESEND',
  // Group Questions
  CreateGroupQuestion = 'CREATE_GROUP_QUESTION',
}
