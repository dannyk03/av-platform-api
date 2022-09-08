import { SetMetadata, applyDecorators } from '@nestjs/common';

import { EXEC_META_CLASS_KEY, EXEC_META_FUNCTION_KEY } from '../constant';

export function ExecMeta(cls: string, func: string): any {
  return applyDecorators(
    SetMetadata(EXEC_META_CLASS_KEY, cls),
    SetMetadata(EXEC_META_FUNCTION_KEY, func),
  );
}
