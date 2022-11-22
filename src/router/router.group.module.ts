import { Module } from '@nestjs/common';

import { GroupModule } from '@/group/group.module';
import { UserModule } from '@/user/user.module';

import { GroupCommonController } from '@/group/controller';

@Module({
  controllers: [GroupCommonController],
  providers: [],
  exports: [],
  imports: [GroupModule, UserModule],
})
export class RouterGroupModule {}
