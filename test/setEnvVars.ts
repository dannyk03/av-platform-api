process.env.TEST_PASSWORD = 'aaAA@@123444';

process.env.APP_NAME = 'platform';
process.env.APP_ENV = 'production';
process.env.APP_MODE = 'secure';
process.env.APP_LANGUAGE = 'en';
process.env.APP_TZ = 'Asia/Jerusalem';

// APP_HOST=0.0.0.0
// APP_PORT=3001
process.env.APP_VERSIONING = 'true';

process.env.APP_HTTP_ON = 'true';
process.env.APP_JOB_ON = 'false';

process.env.MIDDLEWARE_TOLERANCE_TIMESTAMP = '5m';
process.env.MIDDLEWARE_TIMEOUT = '30s';

//  SYSTEM
process.env.AUTH_SYSTEM_ADMIN_EMAIL = 'superadmin@avonow.com';
process.env.AUTH_SYSTEM_ADMIN_INITIAL_PASS = 'Avo12345!';

//  AUTH
process.env.AUTH_JWT_AUDIENCE = 'https://avonow.com';
process.env.AUTH_JWT_ISSUER = 'avonow';
process.env.AUTH_JWT_ACCESS_TOKEN_SECRET_KEY = '123456';
process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRED = '30m';
process.env.AUTH_JWT_REFRESH_TOKEN_SECRET_KEY = '01001231';
process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRED = '7d';
process.env.AUTH_JWT_REFRESH_TOKEN_REMEMBER_ME_EXPIRED = '30d';
process.env.AUTH_JWT_REFRESH_TOKEN_NOT_BEFORE_EXPIRATION = '30m';

// AWS
// AWS_CREDENTIAL_KEY=
// AWS_CREDENTIAL_SECRET=
// AWS_S3_REGION=us-west-1
// AWS_S3_BUCKET=avo

// # CUTOMER.IO
// CUSTOMER_IO_API_KEY=88eb7749b3e9822be2695c3325ae1743
