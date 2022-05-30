import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController, AppService } from '@/app';
import { TenantModule, TenantController, TenantService } from '@/tenant';
import { UserModule } from '@/user';

@Module({
  controllers: [AppController, TenantController],
  providers: [AppService, TenantService],
  exports: [],
  imports: [HttpModule, TenantModule],
})
export class RouterCommonModule {}
