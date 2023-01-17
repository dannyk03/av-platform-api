import { applyDecorators } from '@nestjs/common';

import { Expose } from 'class-transformer';

import { StripHtmlTagsTransform } from './StripHtmlTags.transform';
import { TrimTransform } from './Trim.transform';
import { ITransformOptions } from './transform.interface';

export function NormalizeStringInputTransform(
  options?: ITransformOptions,
): any {
  const each = options?.each;

  return applyDecorators(
    Expose(),
    StripHtmlTagsTransform({ each }),
    TrimTransform({ each }),
  );
}
