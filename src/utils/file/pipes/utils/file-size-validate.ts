import { PayloadTooLargeException } from '@nestjs/common';

import { EnumFileStatusCodeError } from '@avo/type';

import castArray from 'lodash/castArray';

import { IFile } from '../../type';

const validate = async ({
  size,
  maxSizeInBytes,
}: {
  size: number;
  maxSizeInBytes: number;
}): Promise<void> => {
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

  for (const val of castArray(value)) {
    await validate({ size: val.size, maxSizeInBytes });
  }

  return value;
}
