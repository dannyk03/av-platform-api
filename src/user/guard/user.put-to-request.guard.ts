import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { IUserDocument } from '../user.interface';

@Injectable()
export class UserPutToRequestGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { params } = request;
    const { userId } = params;

    const check: IUserDocument =
      await this.userService.findOneById<IUserDocument>(userId);
    request.__user = check;

    return true;
  }
}
