import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { ENUM_PERMISSIONS } from 'src/permission/permission.constant';
import { PermissionBulkService } from 'src/permission/service/permission.bulk.service';
import { DebuggerService } from 'src/debugger/service/debugger.service';
import { PermissionService } from '@/permission/service/permission.service';
import { Permission } from '@/permission/entity/permission.entity';

@Injectable()
export class PermissionSeed {
  constructor(
    private readonly debuggerService: DebuggerService,
    private readonly permissionBulkService: PermissionBulkService,
    private readonly permissionService: PermissionService,
  ) {}

  @Command({
    command: 'insert:permission',
    describe: 'insert permissions',
  })
  async insert(): Promise<void> {
    try {
      const oldPermissions = await this.permissionService.findAll({});
      const oldPermissionsSlugs = oldPermissions.map(({ slug }) => slug);
      const systemPermissionSlugs = Object.values(ENUM_PERMISSIONS);

      const permissions = oldPermissions.map((permission) => {
        const { slug, isActive } = permission;
        if (
          isActive &&
          !systemPermissionSlugs.includes(slug as ENUM_PERMISSIONS)
        ) {
          permission.isActive = false;
        }
        return permission;
      });

      systemPermissionSlugs.forEach((slug) => {
        if (!oldPermissionsSlugs.includes(slug)) {
          permissions.push(
            this.permissionService.createPermissionEntity({
              slug,
              isActive: true,
              description: 'Seed permission',
            }),
          );
        }
      });

      await this.permissionBulkService.saveMany(permissions);

      this.debuggerService.debug(
        'Insert Permission Succeed',
        'PermissionSeed',
        'insert',
      );
    } catch (e) {
      this.debuggerService.error(e.message, 'PermissionSeed', 'insert');
    }
  }

  @Command({
    command: 'remove:permission',
    describe: 'remove permissions',
  })
  async remove(): Promise<void> {
    try {
      await this.permissionBulkService.deleteManyBySlug(
        Object.values(ENUM_PERMISSIONS),
      );

      this.debuggerService.debug(
        'Remove Permission Succeed',
        'PermissionSeed',
        'remove',
      );
    } catch (e) {
      this.debuggerService.error(e.message, 'PermissionSeed', 'remove');
    }
  }
}
