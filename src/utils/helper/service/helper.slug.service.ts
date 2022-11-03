import { Injectable } from '@nestjs/common';

import { IHelperSlugService } from '../type/helper.slug.interface';

import { slugify as slugifyUtil } from '../helper.utils';

@Injectable()
export class HelperSlugService implements IHelperSlugService {
  public slugify(text: string): string {
    return slugifyUtil(text);
  }
}
