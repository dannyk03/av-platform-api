import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileType } from './file.constant';
import { FileImageInterceptor } from './interceptor/file.image.interceptor';

export function UploadFileSingle(
    field: string,
    type: FileType,
    required?: boolean,
): any {
    if (type === FileType.Image) {
        return applyDecorators(
            UseInterceptors(
                FileInterceptor(field),
                FileImageInterceptor(required),
            ),
        );
    }

    return applyDecorators(UseInterceptors(FileInterceptor(field)));
}

export function UploadFileMultiple(
    field: string,
    type: FileType,
    required?: boolean,
): any {
    if (type === FileType.Image) {
        return applyDecorators(
            UseInterceptors(
                FilesInterceptor(field),
                FileImageInterceptor(required),
            ),
        );
    }

    return applyDecorators(UseInterceptors(FilesInterceptor(field)));
}
