import { Injectable } from '@nestjs/common';
import slugify from 'slugify';

export const SLUGIFY_OPTS = {
  lower: true,
  strict: true,
  remove: /[*+~.()'"!:@]/g,
};

export function createSlugFromString(text: string): string {
  return slugify(text, SLUGIFY_OPTS);
}

@Injectable()
export class HelperSlugService {
  public slugify(text: string): string {
    return createSlugFromString(text);
  }
}
