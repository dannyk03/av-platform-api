import {
    Injectable,
    CanActivate,
    ExecutionContext,
    BadRequestException,
} from '@nestjs/common';
import { RoleStatusCodeError } from '../role.constant';
import { Types } from 'mongoose';
import { UserService } from '@/user/service/user.service';
import { DebuggerService } from '@/debugger/service/debugger.service';
import { UserDocument } from '@/user/schema/user.schema';

@Injectable()
export class RoleUsedGuard implements CanActivate {
    constructor(
        private readonly debuggerService: DebuggerService,
        private readonly userService: UserService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { __role } = context.switchToHttp().getRequest();
        const check: UserDocument = await this.userService.findOne({
            role: new Types.ObjectId(__role._id),
        });

        if (check) {
            this.debuggerService.error('Role used', 'RoleUsedGuard', 'delete');
            throw new BadRequestException({
                statusCode: RoleStatusCodeError.RoleUsedError,
                message: 'role.error.used',
            });
        }
        return true;
    }
}
