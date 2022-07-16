import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
// Services
import { DebuggerService } from '@/debugger/service';
import { AuthService } from '@/auth/service';
import { OrganizationService } from '@/organization/service';
import { UserService } from '@/user/service';
import { AclRoleService } from '@acl/role/service';
import { HelperDateService } from '@/utils/helper/service';
import { DisplayLanguageService } from '@/language/display-language/service';
//
import { EnumSystemRole } from '@acl/role';
import { ConnectionNames } from '../database.constant';
import { systemSeedData } from './data';
import { EnumDisplayLanguage } from '@/language/display-language/display-language.constant';

@Injectable()
export class SystemSeed {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService,
    private readonly aclRoleService: AclRoleService,
    private readonly authService: AuthService,
    private readonly displayLanguageService: DisplayLanguageService,
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
                process.env.AUTH_SYSTEM_ADMIN_INITIAL_PASS,
              );

            const systemAdmin = await this.userService.create({
              ...systemSeedData.systemAdmin,
              email: process.env.AUTH_SYSTEM_ADMIN_EMAIL,
              phoneNumber: '+00000000000',
              authConfig: {
                password: passwordHash,
                salt,
                passwordExpiredAt: this.helperDateService.forwardInDays(
                  365 * 10,
                ),
                emailVerifiedAt: this.helperDateService.create(),
              },
              organization: systemOrganization,
              role: systemRoles.find(
                (role) => role.name === EnumSystemRole.SystemAdmin,
              ),
            });

            await transactionalEntityManager.save(systemAdmin);

            // Default Display Language
            const displayLanguageEn = await this.displayLanguageService.create({
              isoCode: EnumDisplayLanguage.En,
            });

            await transactionalEntityManager.save(displayLanguageEn);

            this.debuggerService.debug(
              'Insert System Succeed',
              'SystemSeed',
              'insert',
            );
          } catch (err) {
            this.debuggerService.error(
              err.message,
              'SystemSeed',
              'insert seed transaction',
            );
          }
        },
      );

      this.debuggerService.debug(
        'Insert System Succeed',
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
