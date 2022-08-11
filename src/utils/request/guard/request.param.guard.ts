import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  Type,
  mixin,
} from '@nestjs/common';

import { EnumRequestStatusCodeError } from '@avo/type';

import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';

export function RequestParamRawGuard(
  classValidation: ClassConstructor<any>[],
): Type<CanActivate> {
  @Injectable()
  class MixinRequestParamRawGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const { params } = context.switchToHttp().getRequest();
      for (const cv of classValidation) {
        const request = plainToInstance(cv, params);

        const errors: ValidationError[] = await validate(request);

        if (errors.length > 0) {
          throw new BadRequestException({
            statusCode: EnumRequestStatusCodeError.RequestValidationError,
            message: 'http.clientError.badRequest',
            errors: errors,
          });
        }
      }

      return true;
    }
  }

  return mixin(MixinRequestParamRawGuard);
}
