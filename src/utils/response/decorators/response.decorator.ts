import { SetMetadata, UseInterceptors, applyDecorators } from '@nestjs/common';

import { IResponseOptions } from '../types';

import {
  RESPONSE_CUSTOM_TIMEOUT_META_KEY,
  RESPONSE_CUSTOM_TIMEOUT_VALUE_META_KEY,
  RESPONSE_MESSAGE_PATH_META_KEY,
  RESPONSE_MESSAGE_PROPERTIES_META_KEY,
  RESPONSE_PAGING_TYPE_META_KEY,
  RESPONSE_SERIALIZATION_META_KEY,
} from '../constants/response.constant';

import { EnumPaginationType } from '@/utils/pagination';

import {
  ResponseDefaultInterceptor,
  ResponsePagingInterceptor,
} from '../interceptor';

export function ClientResponse(
  messagePath: string,
  options?: IResponseOptions,
): any {
  return applyDecorators(
    UseInterceptors(ResponseDefaultInterceptor),
    SetMetadata(RESPONSE_MESSAGE_PATH_META_KEY, messagePath),
    SetMetadata(RESPONSE_SERIALIZATION_META_KEY, options?.classSerialization),
    SetMetadata(
      RESPONSE_MESSAGE_PROPERTIES_META_KEY,
      options?.messageProperties,
    ),
  );
}

export function ResponsePagingType(type: EnumPaginationType) {
  return applyDecorators(SetMetadata(RESPONSE_PAGING_TYPE_META_KEY, type));
}

export function ClientResponsePaging(
  messagePath: string,
  options?: IResponseOptions,
): any {
  return applyDecorators(
    UseInterceptors(ResponsePagingInterceptor),
    SetMetadata(RESPONSE_MESSAGE_PATH_META_KEY, messagePath),
    SetMetadata(RESPONSE_SERIALIZATION_META_KEY, options?.classSerialization),
    SetMetadata(
      RESPONSE_MESSAGE_PROPERTIES_META_KEY,
      options?.messageProperties,
    ),
  );
}

export function ResponseTimeout(seconds: string): any {
  return applyDecorators(
    SetMetadata(RESPONSE_CUSTOM_TIMEOUT_META_KEY, true),
    SetMetadata(RESPONSE_CUSTOM_TIMEOUT_VALUE_META_KEY, seconds),
  );
}
