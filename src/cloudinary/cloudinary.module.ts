import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './provider/cloudinary.provider';
import { CloudinaryService } from './service/cloudinary.service';

@Module({
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
