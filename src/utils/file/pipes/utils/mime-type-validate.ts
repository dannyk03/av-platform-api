import { UnsupportedMediaTypeException } from '@nestjs/common';

import { EnumFileStatusCodeError } from '@avo/type';

import { IFile } from '../../type';

const validate = ({
  mimetype,
  allowedMimeTypes,
}: {
  mimetype: string;
  allowedMimeTypes: string[];
}) => {
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

  if (Array.isArray(value)) {
    for (const val of value) {
      validate({ mimetype: val.mimetype, allowedMimeTypes });
    }
  } else {
    validate({ mimetype: value.mimetype, allowedMimeTypes });
  }

  return value;
}
