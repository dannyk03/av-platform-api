import { UseGuards, applyDecorators } from '@nestjs/common';

import { ClassConstructor } from 'class-transformer';

import { RequestParamRawGuard } from './request.param-raw.guard';

export function RequestParamGuard(
  ...classValidation: ClassConstructor<any>[]
): any {
  return applyDecorators(UseGuards(RequestParamRawGuard(classValidation)));
}
