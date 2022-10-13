import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { isEmail } from 'class-validator';
import normalizeEmail from 'validator/lib/normalizeEmail';

import { UserService } from '@/user/service';

@Injectable()
export class UserLoginPutToRequestGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest();
    const { body, user: maybeUser } = request;

    const email = isEmail(body.email)
      ? normalizeEmail(body.email)
      : normalizeEmail(maybeUser.email);

    const requestUser = email
      ? await this.userService.findOne({
          where: { email },

          relations: [
            'organization',
            'authConfig',
            'role',
            'role.policy',
            'role.policy.subjects',
            'role.policy.subjects.abilities',
          ],
          select: {
            organization: {
              isActive: true,
              id: true,
              name: true,
              slug: true,
            },
            authConfig: {
              password: true,
              passwordExpiredAt: true,
            },
          },
        })
      : null;

    request.__user = requestUser;

    return true;
  }
}
