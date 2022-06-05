import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { IUserEntity } from '../user.interface';

@Injectable()
export class UserPutToRequestGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { params } = request;
    const { user } = params;

    const check: IUserEntity = await this.userService.findOneById<IUserEntity>(
      user,
      {
        populate: {
          role: true,
          permission: true,
        },
      },
    );
    request.__user = check;

    return true;
  }
}
