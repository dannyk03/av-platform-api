import { Module } from '@nestjs/common';

import { AwsModule } from '@/aws/aws.module';
import { CloudinaryModule } from '@/cloudinary/cloudinary.module';

import { AwsHealthIndicator } from './indicator/health.aws.indicator';
import { CloudinaryHealthIndicator } from './indicator/health.cloudinary.indicator';

@Module({
  imports: [AwsModule, CloudinaryModule],
  providers: [AwsHealthIndicator, CloudinaryHealthIndicator],
  exports: [AwsHealthIndicator, CloudinaryHealthIndicator],
})
export class HealthModule {}
