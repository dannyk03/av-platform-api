import { registerAs } from '@nestjs/config';

export default registerAs(
  'cloudinary',
  (): Record<string, any> => ({
    credential: {
      key: process.env.CLOUDINARY_API_KEY,
      secret: process.env.CLOUDINARY_API_SECRET,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    },
  }),
);
