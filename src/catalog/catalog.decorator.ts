import { applyDecorators } from '@nestjs/common';

import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { EnumDisplayLanguage } from '@/language/display-language/display-language.constant';

export function ProductDisplayLanguage(): any {
  return applyDecorators(
    Expose(),
    IsEnum(EnumDisplayLanguage),
    IsOptional(),
    Transform(({ value }) => {
      return value ? value : EnumDisplayLanguage.En;
    }),
  );
}

export function ProductSKU(): any {
  return applyDecorators(
    Expose(),
    IsString(),
    Transform(({ value }) => {
      return value ? value.toUpperCase() : undefined;
    }),
  );
}
