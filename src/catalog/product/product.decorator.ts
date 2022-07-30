import { applyDecorators } from '@nestjs/common';

import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

import { EnumDisplayLanguage } from '@/language/display-language';

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
