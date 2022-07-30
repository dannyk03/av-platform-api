import { applyDecorators } from '@nestjs/common';
import { isString } from '@nestjs/common/utils/shared.utils';

import { Expose, Transform } from 'class-transformer';
import { IsEmail, MaxLength } from 'class-validator';
import normalizeEmail from 'validator/lib/normalizeEmail';

import { ITransformOptions } from './transform.interface';

import { NormalizeStringInput } from './NormalizeStringInput.transform';

const emailNormalizeOptions = {
  all_lowercase: true,
  gmail_remove_subaddress: true,
  outlookdotcom_remove_subaddress: true,
  yahoo_remove_subaddress: true,
  icloud_remove_subaddress: true,
  gmail_remove_dots: true,
  gmail_convert_googlemaildotcom: true,
};

export function NormalizeEmail(options?: ITransformOptions): any {
  const each = options?.each;

  return applyDecorators(
    Expose(),
    MaxLength(50),
    IsEmail(undefined, { each }),
    NormalizeStringInput({ each }),
    Transform(({ value }) =>
      each && Array.isArray(value)
        ? value.map((v) => normalizeEmail(v, emailNormalizeOptions))
        : isString(value)
        ? normalizeEmail(value, emailNormalizeOptions)
        : value,
    ),
  );
}
