import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserService } from 'src/user/service/user.service';
import { IUserEntity } from 'src/user/user.interface';

@Injectable()
export class UserPayloadPutToRequestGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user } = request;

    // const check: IUserEntity = await this.userService.findOneById<IUserEntity>(
    //   user.id,
    //   {
    //     populate: {
    //       role: true,
    //       permission: true,
    //     },
    //   },
    // );
    request.__user = 'user';

    return true;
  }
}
