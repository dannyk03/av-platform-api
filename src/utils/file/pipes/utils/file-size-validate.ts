import { PayloadTooLargeException } from '@nestjs/common';

import { EnumFileStatusCodeError } from '@avo/type';

import { IFile } from '../../type';

const validate = ({
  size,
  maxSizeInBytes,
}: {
  size: number;
  maxSizeInBytes: number;
}): void => {
  if (size > maxSizeInBytes) {
    throw new PayloadTooLargeException({
      statusCode: EnumFileStatusCodeError.FileMaxSizeError,
      message: 'file.error.maxSize',
    });
  }
};

export async function fileSizeValidate({
  value,
  maxSizeInBytes,
}: {
  value: IFile | IFile[];
  maxSizeInBytes: number;
}): Promise<IFile | IFile[]> {
  if (!value) {
    return value;
  }

  if (Array.isArray(value)) {
    for (const val of value) {
      validate({ size: val.size, maxSizeInBytes });
    }
  } else {
    validate({ size: value.size, maxSizeInBytes });
  }

  return value;
}
