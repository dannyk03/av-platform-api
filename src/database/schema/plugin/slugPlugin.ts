import { Schema } from 'mongoose';
import slugify from 'slugify';

export function slugPlugin<DocType>(
    fromKey: string,
    slugKey = 'slug',
): (schema: Schema<DocType>, opts?: any) => void {
    return (schema) => {
        if (fromKey && slugKey) {
            schema.pre('validate', function (next) {
                if (this[fromKey]) {
                    this[slugKey] = slugify(this[fromKey], {
                        lower: true,
                        strict: true,
                        // remove: /[*+~.()'"!:@]/g
                    });
                }
                next();
            });
        }
    };
}
