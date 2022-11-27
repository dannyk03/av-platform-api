import { applyDecorators } from '@nestjs/common';
import { isString } from '@nestjs/common/utils/shared.utils';

import { Transform } from 'class-transformer';

import { ITransformOptions } from './transform.interface';

enum EnumPaddingFrom {
  Start,
  End,
}

interface IPadWithTransform {
  from?: EnumPaddingFrom;
  targetLength: number;
  padString: string;
}

export function PadWith(options?: ITransformOptions & IPadWithTransform): any {
  const each = options?.each;
  const from = options?.from ?? EnumPaddingFrom.Start;
  const padString = options.padString;
  const targetLength = options.targetLength;

  return applyDecorators(
    Transform(({ value }) => {
      if (each && Array.isArray(value)) {
        return value.map((v) =>
          isString(v) && v.length
            ? (from ? v.padEnd : v.padStart)?.apply(v, [
                targetLength,
                padString,
              ])
            : v,
        );
      }

      const fn = from ? value.padEnd : value.padStart;
      return isString(value) && value.length
        ? fn.apply(value, [targetLength, padString])
        : value;
    }),
  );
}
