import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';

import { EnumCurrency, EnumDisplayLanguage } from '@avo/type';

import { DataSource } from 'typeorm';

import { AclRoleService } from '@/access-control-list/role/service';
import { AuthService } from '@/auth/service';
import { CurrencyService } from '@/currency/service';
import { DisplayLanguageService } from '@/language/display-language/service';
import { OrganizationService } from '@/organization/service';
import { UserService } from '@/user/service';
import { HelperDateService } from '@/utils/helper/service';

import { EnumSystemRole } from '@/access-control-list/role';
import { ConnectionNames } from '@/database/database.constant';

import { systemSeedData } from '../data';

@Injectable()
export class SystemSeedService {
  constructor(
    @InjectDataSource(ConnectionNames.Default)
    private defaultDataSource: DataSource,
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService,
    private readonly aclRoleService: AclRoleService,
    private readonly authService: AuthService,
    private readonly displayLanguageService: DisplayLanguageService,
    private readonly currencyService: CurrencyService,
    private readonly helperDateService: HelperDateService,
    private readonly configService: ConfigService,
  ) {}

  async insert(): Promise<void> {
    const runSeeds = this.configService.get<boolean>('app.runSeeds');

    if (!runSeeds) {
      return;
    }

    try {
      await this.defaultDataSource.transaction(
        'SERIALIZABLE',
        async (transactionalEntityManager) => {
          const systemRoles = await this.aclRoleService.cloneSaveRolesTree(
            transactionalEntityManager,
            systemSeedData.roles,
          );

          const systemOrganization = await this.organizationService.create({
            ...systemSeedData.organization,
            roles: systemRoles,
          });

          await transactionalEntityManager.save(systemOrganization);

          const { salt, passwordHash } = await this.authService.createPassword(
            process.env.AUTH_SYSTEM_ADMIN_INITIAL_PASS,
          );

          const systemAdmin = await this.userService.create({
            ...systemSeedData.systemAdmin,
            email: process.env.AUTH_SYSTEM_ADMIN_EMAIL,
            phoneNumber: '+00000000000',
            authConfig: {
              password: passwordHash,
              salt,
              passwordExpiredAt: this.helperDateService.forwardInDays(365 * 10),
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

          const currencyUSD = await this.currencyService.create({
            code: EnumCurrency.USD,
          });
          await transactionalEntityManager.save(currencyUSD);
        },
      );
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
