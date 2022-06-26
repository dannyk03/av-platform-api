import slugifyLib from 'slugify';

export const SLUGIFY_OPTS = {
  lower: true,
  strict: true,
  trim: true,
  remove: /[*+~.()'"!:@]/g,
};

export function slugify(text: string): string {
  if (!text) return;
  return slugifyLib(text, SLUGIFY_OPTS);
}
