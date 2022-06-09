import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { ENUM_PERMISSIONS } from 'src/permission/permission.constant';
import { PermissionService } from 'src/permission/service/permission.service';
import { RoleBulkService } from 'src/role/service/role.bulk.service';
import { DebuggerService } from 'src/debugger/service/debugger.service';
import { Permission } from '@/permission/entity/permission.entity';

@Injectable()
export class RoleSeed {
  constructor(
    private readonly debuggerService: DebuggerService,
    private readonly permissionService: PermissionService,
    private readonly roleBulkService: RoleBulkService,
  ) {}

  @Command({
    command: 'insert:role',
    describe: 'insert roles',
  })
  async insert(): Promise<void> {
    const permissions: Permission[] = await this.permissionService.findAll();

    try {
      // const permissionsMap = permissions.map((val) => val.id);
      // await this.roleBulkService.createMany([
      //   {
      //     name: 'admin',
      //     permissions: permissionsMap,
      //   },
      //   {
      //     name: 'user',
      //     permissions: [],
      //   },
      // ]);

      this.debuggerService.debug('Insert Role Succeed', 'RoleSeed', 'insert');
    } catch (e) {
      this.debuggerService.error(e.message, 'RoleSeed', 'insert');
    }
  }

  @Command({
    command: 'remove:role',
    describe: 'remove roles',
  })
  async remove(): Promise<void> {
    try {
      await this.roleBulkService.deleteMany({});

      this.debuggerService.debug('Remove Role Succeed', 'RoleSeed', 'remove');
    } catch (e) {
      this.debuggerService.error(e.message, 'RoleSeed', 'remove');
    }
  }
}
