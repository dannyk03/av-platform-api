import {
  HttpStatus,
  Module,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { EnumRequestStatusCodeError } from '@avo/type';

import { ExecMetaGuard } from './guard/exec-meta.guard';

import { RequestTimestampInterceptor } from './interceptor/request.timestamp.interceptor';
import {
  IsNotEmptyForEnvConstraint,
  IsOnlyDigitsConstraint,
  IsPasswordMediumConstraint,
  IsPasswordStrongConstraint,
  IsPasswordWeakConstraint,
  IsPhoneNumberConstraint,
  IsSmsOtpCodeConstraint,
  IsStartWithConstraint,
  MaxGreaterThanConstraint,
  MaxGreaterThanEqualConstraint,
  MinGreaterThanConstraint,
  MinGreaterThanEqualConstraint,
  RangeTupleConstraint,
  SafeStringConstraint,
  SkipConstraint,
  StringOrNumberOrBooleanConstraint,
} from './validation';

@Module({
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ExecMetaGuard,
    },
    {
      provide: APP_PIPE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new ValidationPipe({
          forbidUnknownValues: true,
          transform: true,
          skipNullProperties: false,
          skipUndefinedProperties: false,
          skipMissingProperties: false,
          whitelist: true,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          enableDebugMessages: configService.get<boolean>('app.debug'),
          exceptionFactory: async (errors: ValidationError[]) => {
            return new UnprocessableEntityException({
              statusCode: EnumRequestStatusCodeError.RequestValidationError,
              message: 'http.clientError.unprocessableEntity',
              errors,
            });
          },
        });
      },
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestTimestampInterceptor,
    },
    IsPasswordStrongConstraint,
    IsPasswordMediumConstraint,
    IsPasswordWeakConstraint,
    IsStartWithConstraint,
    MaxGreaterThanEqualConstraint,
    MaxGreaterThanConstraint,
    MinGreaterThanEqualConstraint,
    MinGreaterThanConstraint,
    SkipConstraint,
    StringOrNumberOrBooleanConstraint,
    SafeStringConstraint,
    IsOnlyDigitsConstraint,
    IsPhoneNumberConstraint,
    RangeTupleConstraint,
    IsSmsOtpCodeConstraint,
    IsNotEmptyForEnvConstraint,
  ],
  imports: [],
})
export class RequestModule {}
