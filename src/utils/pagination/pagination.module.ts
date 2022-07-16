import { Global, Module } from '@nestjs/common';
// Services
import { PaginationService } from './service';
//
@Global()
@Module({
  providers: [PaginationService],
  exports: [PaginationService],
  imports: [],
})
export class PaginationModule {}
