import { applyDecorators } from '@nestjs/common';

import { Expose, Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export function ParamInt(defaultValue: number): any {
  return applyDecorators(
    Expose(),
    IsNumber(),
    Transform(({ value }) => (value ? parseInt(value) : defaultValue)),
  );
}
