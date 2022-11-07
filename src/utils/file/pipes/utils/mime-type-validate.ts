import { UnsupportedMediaTypeException } from '@nestjs/common';

import { EnumFileStatusCodeError } from '@avo/type';

import castArray from 'lodash/castArray';

import { IFile } from '../../type';
import { fromBuffer } from 'file-type';

const validate = async ({
  mimetype,
  allowedMimeTypes,
}: {
  mimetype: string;
  allowedMimeTypes: string[];
}): Promise<void> => {
  if (!allowedMimeTypes.includes(mimetype.toLowerCase())) {
    throw new UnsupportedMediaTypeException({
      statusCode: EnumFileStatusCodeError.FileExtensionError,
      message: 'file.error.mimeInvalid',
    });
  }
};

export async function mimetypeValidate({
  value,
  allowedMimeTypes,
}: {
  value: IFile | IFile[];
  allowedMimeTypes: string[];
}): Promise<IFile | IFile[]> {
  if (!value) {
    return;
  }

  for (const val of castArray(value)) {
    // The file type declared on the file.
    await validate({ mimetype: val.mimetype, allowedMimeTypes });
    // The file type is detected by checking the magic number of the buffer.
    const fileType = await fromBuffer(val.buffer);
    await validate({
      mimetype: fileType.mime,
      allowedMimeTypes: [val.mimetype],
    });
  }

  return value;
}
