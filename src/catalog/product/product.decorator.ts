import { applyDecorators } from '@nestjs/common';

import { EnumDisplayLanguage } from '@avo/type';

import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

export function ProductDisplayLanguage(): any {
  return applyDecorators(
    Expose(),
    IsOptional(),
    IsEnum(EnumDisplayLanguage),
    Transform(({ value }) => {
      return Object.values(EnumDisplayLanguage).includes(value)
        ? value
        : EnumDisplayLanguage.En;
    }),
  );
}
