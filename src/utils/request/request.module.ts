import {
  HttpStatus,
  Module,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { RequestControllerGuard } from './guard/request.controller.guard';
import { RequestTimestampInterceptor } from './interceptor/request.timestamp.interceptor';
import { EnumRequestStatusCodeError } from './request.constant';
import { IsPhoneNumberConstraint } from './validation/request.is-mobile-number.validation';
import { IsPasswordMediumConstraint } from './validation/request.is-password-medium.validation';
import { IsPasswordStrongConstraint } from './validation/request.is-password-strong.validation';
import { IsPasswordWeakConstraint } from './validation/request.is-password-weak.validation';
import { IsStartWithConstraint } from './validation/request.is-start-with.validation';
import { MaxGreaterThanEqualConstraint } from './validation/request.max-greater-than-equal.validation';
import { MaxGreaterThanConstraint } from './validation/request.max-greater-than.validation';
import { MinGreaterThanEqualConstraint } from './validation/request.min-greater-than-equal.validation';
import { MinGreaterThanConstraint } from './validation/request.min-greater-than.validation';
import { IsOnlyDigitsConstraint } from './validation/request.only-digits.validation';
import { SafeStringConstraint } from './validation/request.safe-string.validation';
import { SkipConstraint } from './validation/request.skip.validation';
import { StringOrNumberOrBooleanConstraint } from './validation/request.string-or-number-or-boolean.validation';

@Module({
  controllers: [],
  providers: [
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
    {
      provide: APP_GUARD,
      useClass: RequestControllerGuard,
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
  ],
  imports: [],
})
export class RequestModule {}
