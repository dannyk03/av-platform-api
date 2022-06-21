import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Type,
  mixin,
  BadRequestException,
} from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { EnumRequestStatusCodeError } from '../request.constant';

export function ParamGuard(
  classValidation: ClassConstructor<any>[],
): Type<CanActivate> {
  @Injectable()
  class MixinParamGuard implements CanActivate {
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

  return mixin(MixinParamGuard);
}
