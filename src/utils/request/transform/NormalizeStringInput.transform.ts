import { applyDecorators } from '@nestjs/common';

import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

import { ITransformOptions } from './transform.interface';

import { Escape } from './Escape.transform';
import { Trim } from './Trim.transform';

export function NormalizeStringInput(options?: ITransformOptions): any {
  const each = options?.each;

  return applyDecorators(
    Expose(),
    IsString({ each }),
    Trim({ each }),
    Escape({ each }),
  );
}
