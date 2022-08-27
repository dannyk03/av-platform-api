import { SetMetadata, applyDecorators } from '@nestjs/common';

import { ERROR_META_CLASS_KEY, ERROR_META_FUNCTION_KEY } from '../constants';

export function ErrorMeta(cls: string, func: string): any {
  return applyDecorators(
    SetMetadata(ERROR_META_CLASS_KEY, cls),
    SetMetadata(ERROR_META_FUNCTION_KEY, func),
  );
}
