import { applyDecorators } from '@nestjs/common';

import { Expose, Transform } from 'class-transformer';
import { isString } from 'class-validator';
import SqlString from 'sqlstring';

import { TrimTransform } from './Trim.transform';
import { ITransformOptions } from './transform.interface';

interface ISearchStringEscapeTransform {
  allow?: string[];
}

export function SqlStringEscapeTransform(
  options?: ITransformOptions & ISearchStringEscapeTransform,
): any {
  const each = options?.each;

  return applyDecorators(
    Expose(),
    TrimTransform({ each }),
    Transform(({ value }) => {
      if (each && Array.isArray(value)) {
        return value
          .map((v) => (isString(v) && v.length ? SqlString.escape(v) : v))
          .filter(Boolean);
      }

      if (isString(value) && value.length) {
        return SqlString.escape(value);
      }

      return value;
    }),
  );
}
