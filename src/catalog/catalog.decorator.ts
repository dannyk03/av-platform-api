import { EnumDisplayLanguage } from '@/language/display-language/display-language.constant';
import { applyDecorators } from '@nestjs/common';
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

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
