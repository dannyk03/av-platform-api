import { UnprocessableEntityException } from '@nestjs/common';

import { EnumFileStatusCodeError } from '@avo/type';

import { IFile } from '../../type';

const validate = ({ size, maxFiles }: { size: number; maxFiles: number }) => {
  if (size > maxFiles) {
    throw new UnprocessableEntityException({
      statusCode: EnumFileStatusCodeError.FileMaxFilesError,
      message: 'file.error.maxFiles',
    });
  }
};

export async function maxFilesValidate({
  value,
  maxFiles,
}: {
  value: IFile[];
  maxFiles: number;
}): Promise<IFile[]> {
  if (!value) {
    return;
  }

  validate({ size: value.length, maxFiles });

  return value;
}
