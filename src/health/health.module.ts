import { Module } from '@nestjs/common';
// Modules
import { AwsModule } from '$/aws/aws.module';
import { CloudinaryModule } from '$/cloudinary/cloudinary.module';
// Indicators
import { AwsHealthIndicator } from './indicator/health.aws.indicator';
import { CloudinaryHealthIndicator } from './indicator/health.cloudinary.indicator';
//

@Module({
  providers: [AwsHealthIndicator, CloudinaryHealthIndicator],
  exports: [AwsHealthIndicator, CloudinaryHealthIndicator],
  imports: [AwsModule, CloudinaryModule],
})
export class HealthModule {}
