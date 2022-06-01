import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { Permissions } from '@/permission/permission.constant';
import { PermissionBulkService } from '@/permission/service/permission.bulk.service';
import { DebuggerService } from '@/debugger/service/debugger.service';

@Injectable()
export class PermissionSeed {
    constructor(
        private readonly debuggerService: DebuggerService,
        private readonly permissionBulkService: PermissionBulkService,
    ) {}

    @Command({
        command: 'insert:permission',
        describe: 'insert permissions',
    })
    async insert(): Promise<void> {
        try {
            const permissions = Object.values(Permissions).map((val) => ({
                code: val,
                name: val.replace('_', ' ').toLowerCase(),
            }));

            await this.permissionBulkService.createMany(permissions);

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
            await this.permissionBulkService.deleteMany({});

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
