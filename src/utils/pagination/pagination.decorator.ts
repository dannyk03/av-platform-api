import { UsePipes, applyDecorators } from '@nestjs/common';

import { EnumPaginationSortType } from '@avo/type';

import { Expose, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import capitalize from 'lodash/capitalize';

import {
  IPaginationFilterDateOptions,
  IPaginationFilterOptions,
  IPaginationFilterStringOptions,
} from './pagination.interface';

import { RequestAddDatePipe } from '@/utils/request/pipe';

import { MinGreaterThan, RangeTuple, Skip } from '../request/validation';
import {
  PAGINATION_DEFAULT_AVAILABLE_SORT,
  PAGINATION_DEFAULT_PAGE,
  PAGINATION_DEFAULT_PER_PAGE,
  PAGINATION_DEFAULT_SORT,
} from './pagination.constant';

export function PaginationSearch(): any {
  return applyDecorators(
    Expose(),
    IsOptional(),
    IsString(),
    Transform(({ value }) => {
      return value ? value : undefined;
    }),
  );
}

export function PaginationMultiSearch(): any {
  return applyDecorators(
    Expose(),
    IsOptional(),
    IsArray(),
    IsString({ each: true }),
    Transform(({ value }) => {
      return value ? Array.from(new Set(value.split(','))) : undefined;
    }),
  );
}

export function PaginationAvailableSearch(availableSearch: string[]): any {
  return applyDecorators(
    Expose(),
    Transform(() => availableSearch),
  );
}

export function PaginationPage(page = PAGINATION_DEFAULT_PAGE): any {
  return applyDecorators(
    Expose(),
    Min(1),
    IsPositive(),
    Type(() => Number),
    Transform(({ value }) => (Number.isInteger(value) ? value : page)),
  );
}

export function PaginationPerPage(perPage = PAGINATION_DEFAULT_PER_PAGE): any {
  return applyDecorators(
    Expose(),
    Min(1),
    IsPositive(),
    Type(() => Number),
    Transform(({ value }) => (Number.isInteger(value) ? value : perPage)),
  );
}

export function PaginationSort(
  sort = PAGINATION_DEFAULT_SORT,
  availableSort = PAGINATION_DEFAULT_AVAILABLE_SORT,
  nestingAliasMap?: Record<string, string>,
): any {
  return applyDecorators(
    Expose(),
    Transform(({ value, obj }) => {
      const bSort = PAGINATION_DEFAULT_SORT.split('@')[0];

      const rSort = value || sort;
      const rAvailableSort = obj._availableSort || availableSort;
      const [field, type]: string = rSort.split('@');
      const convertField: string = rAvailableSort.includes(field)
        ? field
        : bSort;
      const convertType =
        type?.toLocaleLowerCase() === 'desc' || type === '-1'
          ? EnumPaginationSortType.Desc
          : EnumPaginationSortType.Asc;

      const key = nestingAliasMap?.[convertField] || convertField;
      // .split('.')
      // .map((f) => snakeCase(f))
      // .join('.');
      return { [key]: convertType };
    }),
  );
}

export function PaginationAvailableSort(
  availableSort = PAGINATION_DEFAULT_AVAILABLE_SORT,
): any {
  return applyDecorators(
    Expose(),
    Transform(({ value }) => (!value ? availableSort : value)),
  );
}

export function PaginationFilterBoolean(defaultValue: boolean[]): any {
  return applyDecorators(
    Expose(),
    IsBoolean({ each: true }),
    Transform(({ value }) =>
      value
        ? [
            ...new Set(
              value
                .split(',')
                .filter((val: string) => ['true', 'false'].includes(val))
                .map((val: string) => val === 'true'),
            ),
          ]
        : defaultValue,
    ),
  );
}

export function PaginationFilterRange(): any {
  return applyDecorators(
    Expose(),
    IsNumber(
      { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 },
      { each: true },
    ),
    RangeTuple(),
    Transform(({ value }) => {
      const split: [string, string] = value?.split('-');

      return split && [Number(split[0]), Number(split[1])];
    }),
  );
}

export function PaginationFilterEnum<T>(
  defaultValue: T[],
  defaultEnum: Record<string, any>,
): any {
  const cEnum = defaultEnum as unknown;
  return applyDecorators(
    Expose(),
    IsEnum(cEnum as object, { each: true }),
    Transform(({ value }) =>
      value
        ? value.split(',').map((val: string) => defaultEnum[capitalize(val)])
        : defaultValue,
    ),
  );
}

export function PaginationFilterId(
  field: string,
  options?: IPaginationFilterOptions,
): any {
  return applyDecorators(
    Expose(),
    options?.required ? IsNotEmpty() : Skip(),
    options?.required ? Skip() : ValidateIf((e) => e[field] !== '' && e[field]),
  );
}

export function PaginationFilterDate(
  field: string,
  options?: IPaginationFilterDateOptions,
): any {
  return applyDecorators(
    Expose(),
    IsDate(),
    Type(() => Date),
    options?.required ? IsNotEmpty() : IsOptional(),
    options?.required
      ? Skip()
      : options.asEndDate
      ? ValidateIf(
          (e) =>
            e[field] !== '' &&
            e[options.asEndDate.moreThanField] !== '' &&
            e[field] &&
            e[options.asEndDate.moreThanField],
        )
      : ValidateIf((e) => e[field] !== '' && e[field]),
    options?.asEndDate
      ? MinGreaterThan(options.asEndDate.moreThanField)
      : Skip(),
    options?.asEndDate ? UsePipes(RequestAddDatePipe(1)) : Skip(),
  );
}

export function PaginationFilterString(
  field: string,
  options?: IPaginationFilterStringOptions,
) {
  return applyDecorators(
    Expose(),
    IsString(),
    options?.lowercase
      ? Transform(({ value }) =>
          value
            ? value.split(',').map((val: string) => val.toLowerCase())
            : undefined,
        )
      : Skip(),
    options?.required ? IsNotEmpty() : IsOptional(),
    options?.required ? Skip() : ValidateIf((e) => e[field] !== '' && e[field]),
  );
}
