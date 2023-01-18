import { isString } from 'class-validator';
import unescape from 'validator/lib/unescape';

export function unescapeString(input: string) {
  return isString(input) && input.length ? unescape(input) : input;
}
