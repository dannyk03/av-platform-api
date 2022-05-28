import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsS3Service {
  private readonly bucket: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.bucket = this.configService.get<string>('aws.s3.bucket');
    this.baseUrl = this.configService.get<string>('aws.s3.baseUrl');
  }

  listBucket(): void {
    // TODO
  }
}
