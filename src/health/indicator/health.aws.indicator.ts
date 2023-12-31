import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';

import { AwsS3Service } from '@/aws/service';

@Injectable()
export class AwsHealthIndicator extends HealthIndicator {
  constructor(private readonly awsS3Service: AwsS3Service) {
    super();
  }

  async isHealthy(key = 'aws'): Promise<HealthIndicatorResult> {
    try {
      await this.awsS3Service.listBucket();
      return this.getStatus(key, true);
    } catch (error) {
      throw new HealthCheckError('AWS failed', this.getStatus(key, false));
    }
  }
}
