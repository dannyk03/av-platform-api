import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
// Services
import { CloudinaryService } from '$/cloudinary/service';
//

@Injectable()
export class CloudinaryHealthIndicator extends HealthIndicator {
  constructor(private readonly cloudinaryService: CloudinaryService) {
    super();
  }

  async isHealthy(key = 'cloudinary'): Promise<HealthIndicatorResult> {
    try {
      await this.cloudinaryService.ping();
      return this.getStatus(key, true);
    } catch (error) {
      throw new HealthCheckError(
        'Cloudinary failed',
        this.getStatus(key, false),
      );
    }
  }
}
