import { registerAs } from '@nestjs/config';

export default registerAs(
  'cloudinary',
  (): Record<string, any> => ({
    credential: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      key: process.env.CLOUDINARY_API_KEY,
      secret: process.env.CLOUDINARY_API_SECRET,
    },
    addons: {
      perceptionPointMalwareDetectionOn:
        process.env.CLOUDINARY_ADD_ON_PERCEPTION_POINT_MALWARE_DETECTION_ON ===
        'true',
    },
  }),
);
