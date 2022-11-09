import { registerAs } from '@nestjs/config';

export default registerAs(
  'default',
  (): Record<string, any> => ({
    product: {
      imageUrl:
        'https://res.cloudinary.com/avonow/image/upload/v1668007907/platform/en/products/default/hzfbxoejxzai1ozul27h.jpg',
    },
  }),
);
