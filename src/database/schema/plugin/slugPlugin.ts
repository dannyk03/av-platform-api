import { Schema } from 'mongoose';
import { createSlugFromString } from '@/utils/helper/service/helper.slug.service';

export function slugPlugin<DocType>(
    fromKey: string,
    force = false,
    slugKey = 'slug',
): (schema: Schema<DocType>, opts?: any) => void {
    return (schema) => {
        if (fromKey && slugKey) {
            schema.pre('validate', function (next) {
                if (
                    typeof this[fromKey] === 'string' &&
                    (!this[slugKey] || force)
                ) {
                    this[slugKey] = createSlugFromString(this[fromKey]);
                }
                next();
            });
        }
    };
}
