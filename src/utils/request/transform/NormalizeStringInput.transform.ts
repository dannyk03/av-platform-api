import { applyDecorators } from '@nestjs/common';

import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

import { Escape } from './Escape.transform';
import { Trim } from './Trim.transform';
import { ITransformOptions } from './transform.interface';

export function NormalizeStringInput(options?: ITransformOptions): any {
  const each = options?.each;

  return applyDecorators(
    Expose(),
    IsString({ each }),
    Trim({ each }),
    Escape({ each }),
  );
}
