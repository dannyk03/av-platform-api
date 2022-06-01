import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { SLUGIFY_OPTS } from '@/database';

export function createSlugFromString(text: string): string {
    return slugify(text, SLUGIFY_OPTS);
}

@Injectable()
export class HelperSlugService {
    public slugify(text: string): string {
        return createSlugFromString(text);
    }
}
