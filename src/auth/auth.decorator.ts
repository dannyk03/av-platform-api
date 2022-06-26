import {
  UseGuards,
  createParamDecorator,
  ExecutionContext,
  applyDecorators,
  SetMetadata,
} from '@nestjs/common';
import { AclAbilityGuard } from '@acl/ability/guard';
import { JwtRefreshGuard } from './guard/jwt-refresh/auth.jwt-refresh.guard';
import { JwtGuard } from './guard/jwt/auth.jwt.guard';
import { AuthActiveGuard } from './guard/payload/auth.is-active.guard';
import { AuthPayloadPasswordExpiredGuard } from './guard/payload/auth.password-expired.guard';
import { ABILITY_META_KEY } from '@acl/ability';
import { IReqAclAbility } from '@acl/acl.interface';
import { ReqUserAclRoleActiveGuard } from '@acl/role/guard/acl-role.active.guard';
import { ReqUserOrganizationActiveGuard } from '@/organization/guard/organization.active.guard';
import { ReqUserActiveGuard } from '@/user/guard/user.active.guard';
import { UserPutToRequestGuard } from '@/user/guard/user.put-to-request.guard';

export function AuthChangePasswordGuard(...abilities: IReqAclAbility[]): any {
  return applyDecorators(
    UseGuards(JwtGuard, AuthActiveGuard, AclAbilityGuard),
    SetMetadata(ABILITY_META_KEY, abilities),
  );
}

export function AclGuard(...abilities: IReqAclAbility[]) {
  return applyDecorators(
    UseGuards(
      JwtGuard,
      UserPutToRequestGuard,
      ReqUserActiveGuard,
      ReqUserAclRoleActiveGuard,
      ReqUserOrganizationActiveGuard,
      AuthPayloadPasswordExpiredGuard,
      AclAbilityGuard,
    ),
    SetMetadata(ABILITY_META_KEY, abilities),
  );
}

export function AuthRefreshJwtGuard(): any {
  return applyDecorators(UseGuards(JwtRefreshGuard));
}

export const ReqJwtUser = createParamDecorator(
  (data: string, ctx: ExecutionContext): Record<string, any> => {
    const { user } = ctx.switchToHttp().getRequest();
    return data ? user[data] : user;
  },
);

export const Token = createParamDecorator(
  (data: string, ctx: ExecutionContext): string => {
    const { headers } = ctx.switchToHttp().getRequest();
    const { authorization } = headers;
    return authorization ? authorization.split(' ')[1] : undefined;
  },
);
