import { Module } from '@nestjs/common';
// Services
import { AwsS3Service } from './service';
//

@Module({
  exports: [AwsS3Service],
  providers: [AwsS3Service],
  imports: [],
  controllers: [],
})
export class AwsModule {}
