import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
// Services
import { DebuggerService } from '@/debugger/service/debugger.service';
import { AuthService } from '@/auth/service/auth.service';
import { OrganizationService } from '@/organization/service/organization.service';
import { UserService } from '@/user/service/user.service';
import { AclRoleService } from '@acl/role/service/acl-role.service';
import { HelperDateService } from '@/utils/helper';
//
import { EnumSystemRole } from '@acl/role';
import { ConnectionNames } from '../database.constant';
import { systemSeedData } from './data';

@Injectable()
export class SystemSeed {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService,
    private readonly aclRoleService: AclRoleService,
    private readonly authService: AuthService,
    private readonly helperDateService: HelperDateService,
    private readonly debuggerService: DebuggerService,
  ) {}

  @Command({
    command: 'insert:system',
    describe: 'insert system data',
  })
  async insert(): Promise<void> {
    try {
      await this.defaultDataSource.transaction(
        'SERIALIZABLE',
        async (transactionalEntityManager) => {
          try {
            const systemRoles = await this.aclRoleService.cloneSaveRolesTree(
              transactionalEntityManager,
              systemSeedData.roles,
            );

            const systemOrganization = await this.organizationService.create({
              ...systemSeedData.organization,
              roles: systemRoles,
            });

            await transactionalEntityManager.save(systemOrganization);

            const { salt, passwordHash } =
              await this.authService.createPassword(
                process.env.AUTH_SUPER_ADMIN_INITIAL_PASS,
              );

            const superAdmin = await this.userService.create({
              ...systemSeedData.superAdmin,
              mobileNumber: '+00000000000',
              password: passwordHash,
              salt,
              passwordExpired: this.helperDateService.forwardInDays(365 * 10),
              organization: systemOrganization,
              role: systemRoles.find(
                (role) => role.name === EnumSystemRole.SystemAdmin,
              ),
            });

            await transactionalEntityManager.save(superAdmin);

            this.debuggerService.debug(
              'Insert Super Succeed',
              'SuperSeed',
              'insert',
            );
          } catch (err) {
            this.debuggerService.error(
              err.message,
              'SuperSeed',
              'insert seed transaction',
            );
          }
        },
      );

      this.debuggerService.debug(
        'Insert Super Succeed',
        'SystemSeed',
        'insert',
      );
    } catch (err) {
      this.debuggerService.error(err.message, 'SystemSeed', 'insert');
    }
  }

  @Command({
    command: 'remove:system',
    describe: 'remove system data',
  })
  async remove(): Promise<void> {
    try {
      throw new Error('Not Implemented remove:system');
      this.debuggerService.debug(
        'Remove System Succeed',
        'SystemSeed',
        'remove',
      );
    } catch (e) {
      this.debuggerService.error(e.message, 'SystemSeed', 'remove');
    }
  }
}
