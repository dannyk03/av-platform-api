import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import {
    Permissions,
    PermissionService,
    PermissionDocument,
} from '@/permission';
import { RoleBulkService, RolesAndPermissions, Roles } from '@/role';
import { DebuggerService } from '@/debugger/service/debugger.service';

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
        const permissions: PermissionDocument[] =
            await this.permissionService.findAll({
                code: { $in: Object.values(Permissions) },
            });

        try {
            // const permissionsMap = permissions.map((val) => val._id);
            await this.roleBulkService.createMany([
                {
                    name: Roles.SuperAdmin,
                    code: Roles.SuperAdmin,
                    permissions: permissions
                        .filter((val) =>
                            RolesAndPermissions[Roles.SuperAdmin].includes(
                                val.code,
                            ),
                        )
                        .map((val) => val.id),
                },
                {
                    name: Roles.Owner,
                    code: Roles.Owner,
                    permissions: permissions
                        .filter((val) =>
                            RolesAndPermissions[Roles.Owner].includes(val.code),
                        )
                        .map((val) => val.id),
                },
                {
                    name: Roles.Admin,
                    code: Roles.Admin,
                    permissions: permissions
                        .filter((val) =>
                            RolesAndPermissions[Roles.Admin].includes(val.code),
                        )
                        .map((val) => val.id),
                },
                {
                    name: Roles.Manager,
                    code: Roles.Manager,
                    permissions: permissions
                        .filter((val) =>
                            RolesAndPermissions[Roles.Manager].includes(
                                val.code,
                            ),
                        )
                        .map((val) => val.id),
                },
                {
                    name: Roles.User,
                    code: Roles.User,
                    permissions: permissions
                        .filter((val) =>
                            RolesAndPermissions[Roles.Manager].includes(
                                val.code,
                            ),
                        )
                        .map((val) => val.id),
                },
            ]);

            this.debuggerService.debug(
                'Insert Role Succeed',
                'RoleSeed',
                'insert',
            );
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

            this.debuggerService.debug(
                'Remove Role Succeed',
                'RoleSeed',
                'remove',
            );
        } catch (e) {
            this.debuggerService.error(e.message, 'RoleSeed', 'remove');
        }
    }
}
