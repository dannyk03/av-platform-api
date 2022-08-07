import { applyDecorators } from '@nestjs/common';

import { EnumCurrency } from '@avo/type';

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

export function ProductCurrency(): any {
  return applyDecorators(
    Expose(),
    IsEnum(EnumCurrency),
    IsOptional(),
    Transform(({ value }) => {
      return value ? value : EnumCurrency.USD;
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
