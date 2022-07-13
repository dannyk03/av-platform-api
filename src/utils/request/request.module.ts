import {
  HttpStatus,
  Module,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
// Services
import { DebuggerService } from '@/debugger/service/debugger.service';
//
import { EnumRequestStatusCodeError } from './request.constant';
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
import { IsPhoneNumberConstraint } from './validation/request.is-mobile-number.validation';
import { RequestTimestampInterceptor } from './interceptor/request.timestamp.interceptor';

@Module({
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      inject: [DebuggerService],
      useFactory: (debuggerService: DebuggerService) => {
        return new ValidationPipe({
          transform: true,
          skipNullProperties: false,
          skipUndefinedProperties: false,
          skipMissingProperties: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          exceptionFactory: async (errors: ValidationError[]) => {
            debuggerService.error(
              'Request validation error',
              'RequestModule',
              'exceptionFactory',
              errors,
            );

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
  ],
  imports: [],
})
export class RequestModule {}
