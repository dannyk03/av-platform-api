import { Injectable } from '@nestjs/common';
import { slugify as slugifyUtil } from '../helper.utils';

@Injectable()
export class HelperSlugService {
  public slugify(text: string): string {
    return slugifyUtil(text);
  }
}
