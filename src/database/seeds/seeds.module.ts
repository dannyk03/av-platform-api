import { AcpAbility } from '@/access-control-policy/ability';
import { AcpPolicy } from '@/access-control-policy/policy';
import { AcpRole } from '@/access-control-policy/role';
import { AcpSubject } from '@/access-control-policy/subject';
import { AuthModule } from '@/auth/auth.module';
import { Organization, OrganizationModule } from '@/organization';
import { RoleModule } from '@/role/role.module';
import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandModule } from 'nestjs-command';
import { CoreModule } from 'src/core/core.module';
import { ConnectionNames } from '../database.constant';
import { SuperSeed } from './super.seed';

@Module({
  imports: [
    CoreModule,
    CommandModule,
    AuthModule,
    TypeOrmModule.forFeature([Organization], ConnectionNames.Default),
    TypeOrmModule.forFeature([AcpRole], ConnectionNames.Default),
    TypeOrmModule.forFeature([AcpPolicy], ConnectionNames.Default),
    TypeOrmModule.forFeature([AcpSubject], ConnectionNames.Default),
    TypeOrmModule.forFeature([AcpAbility], ConnectionNames.Default),
    UserModule,
  ],
  providers: [SuperSeed],
  exports: [],
})
export class SeedsModule {}
