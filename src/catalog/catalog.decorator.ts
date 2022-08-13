import { applyDecorators } from '@nestjs/common';

import { EnumCurrency, EnumDisplayLanguage } from '@avo/type';

import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';

export function ProductDisplayLanguage(): any {
  return applyDecorators(
    Expose(),
    IsEnum(EnumDisplayLanguage),
    Transform(({ value }) => {
      return value ?? EnumDisplayLanguage.En;
    }),
  );
}

export function ProductCurrency(): any {
  return applyDecorators(
    Expose(),
    IsEnum(EnumCurrency),
    Transform(({ value }) => {
      return value ?? EnumCurrency.USD;
    }),
  );
}

export function ProductSKU(): any {
  return applyDecorators(
    Expose(),
    IsString(),
    Transform(({ value }) => {
      return value?.toUpperCase() ?? undefined;
    }),
  );
}
