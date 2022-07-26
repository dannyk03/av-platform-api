// import {
//   Injectable,
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
// } from '@nestjs/common';

// import { DebuggerService } from '@/debugger/service';
//
// import { EnumUserStatusCodeError } from '../user.constant';

// @Injectable()
// export class ReqGuestActiveGuard implements CanActivate {
//   constructor(private readonly debuggerService: DebuggerService) {}

//   async canActivate(ctx: ExecutionContext): Promise<boolean> {
//     const { __user } = ctx.switchToHttp().getRequest();

//     if (__user && !__user.isActive) {
//       this.debuggerService.error(
//         'Guest inactive error',
//         'ReqGuestActiveGuard',
//         'canActivate',
//       );

//       throw new ForbiddenException({
//         statusCode: EnumUserStatusCodeError.UserInactiveError,
//         message: 'user.error.inactive',
//       });
//     }
//     return true;
//   }
// }
