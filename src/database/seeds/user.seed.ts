import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { UserService } from '@/user/service/user.service';
import { UserBulkService } from '@/user/service/user.bulk.service';
import { RoleService } from '@/role/service/role.service';
import { AuthService } from '@/auth/service/auth.service';
import { RoleDocument } from '@/role/schema/role.schema';
import { DebuggerService } from '@/debugger/service/debugger.service';

const SUPER_ADMIN_EMAIL = 'admin@avonow.com';
const SUPER_ADMIN_PASS = 'Avo123';

@Injectable()
export class UserSeed {
    constructor(
        private readonly debuggerService: DebuggerService,
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly userBulkService: UserBulkService,
        private readonly roleService: RoleService,
    ) {}

    @Command({
        command: 'insert:user',
        describe: 'insert users',
    })
    async insert(): Promise<void> {
        const role: RoleDocument = await this.roleService.findOne<RoleDocument>(
            {
                code: 'SUPER_ADMIN',
            },
        );

        try {
            const password = await this.authService.createPassword(
                SUPER_ADMIN_PASS,
            );

            await this.userService.create({
                firstName: 'admin',
                lastName: 'admin',
                email: SUPER_ADMIN_EMAIL,
                password: password.passwordHash,
                passwordExpired: password.passwordExpired,
                // mobileNumber: '08111111111',
                role: role._id,
                salt: password.salt,
            });

            this.debuggerService.debug(
                'Insert User Succeed',
                'UserSeed',
                'insert',
            );
        } catch (e) {
            this.debuggerService.error(e.message, 'UserSeed', 'insert');
        }
    }

    @Command({
        command: 'remove:user',
        describe: 'remove users',
    })
    async remove(): Promise<void> {
        try {
            await this.userBulkService.deleteMany({ email: SUPER_ADMIN_EMAIL });

            this.debuggerService.debug(
                'Remove User Succeed',
                'UserSeed',
                'remove',
            );
        } catch (e) {
            this.debuggerService.error(e.message, 'UserSeed', 'remove');
        }
    }
}
