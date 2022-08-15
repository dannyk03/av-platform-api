import { applyDecorators } from '@nestjs/common';

import { EnumCurrency, EnumDisplayLanguage } from '@avo/type';

import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsString, isEmpty, isString } from 'class-validator';

export function ProductDisplayLanguage(): any {
  return applyDecorators(
    Expose(),
    IsEnum(EnumDisplayLanguage),
    Transform(({ value }) => {
      return isEmpty(value) ? EnumDisplayLanguage.En : value;
    }),
  );
}

export function ProductCurrency(): any {
  return applyDecorators(
    Expose(),
    IsEnum(EnumCurrency),
    Transform(({ value }) => {
      return isEmpty(value) ? EnumCurrency.USD : value;
    }),
  );
}

export function ProductSKU(): any {
  return applyDecorators(
    Expose(),
    IsString(),
    Transform(({ value }) => {
      return isString(value) ? value.toUpperCase() : value;
    }),
  );
}
