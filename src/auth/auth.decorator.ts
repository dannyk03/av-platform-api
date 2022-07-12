import {
  UseGuards,
  createParamDecorator,
  ExecutionContext,
  applyDecorators,
  SetMetadata,
} from '@nestjs/common';
import { ABILITY_META_KEY } from '@acl/ability';
import { IReqAclAbility } from '@acl/acl.interface';
import { SYSTEM_ONLY_META_KEY } from '@/system';
// Guards
import {
  ReqUserActiveGuard,
  ReqUserSystemOnlyGuard,
  UserPutToRequestGuard,
} from '@/user/guard';
import { AclAbilityGuard } from '@acl/ability/guard';
import { JwtGuard } from './guard/jwt/auth.jwt.guard';
import { ReqUserAclRoleActiveGuard } from '@acl/role/guard';
import { ReqUserOrganizationActiveGuard } from '@/organization/guard';
import { JwtRefreshGuard } from './guard/jwt-refresh/auth.jwt-refresh.guard';
import { AuthPayloadPasswordExpiredGuard } from './guard/payload/auth.password-expired.guard';

//

export function IsActiveGuard(): any {
  return applyDecorators(
    UseGuards(
      UserPutToRequestGuard,
      ReqUserActiveGuard,
      ReqUserAclRoleActiveGuard,
      ReqUserOrganizationActiveGuard,
    ),
  );
}

export function AuthChangePasswordGuard(...abilities: IReqAclAbility[]): any {
  return applyDecorators(
    UseGuards(
      JwtGuard,
      UserPutToRequestGuard,
      ReqUserActiveGuard,
      ReqUserAclRoleActiveGuard,
      ReqUserOrganizationActiveGuard,
      AclAbilityGuard,
    ),
    SetMetadata(ABILITY_META_KEY, abilities),
  );
}

export function AclGuard(
  abilities: IReqAclAbility[] = [],
  { systemOnly }: { systemOnly: boolean } = { systemOnly: false },
) {
  return applyDecorators(
    UseGuards(
      JwtGuard,
      UserPutToRequestGuard,
      ReqUserActiveGuard,
      ReqUserAclRoleActiveGuard,
      ReqUserOrganizationActiveGuard,
      AuthPayloadPasswordExpiredGuard,
      AclAbilityGuard,
      ReqUserSystemOnlyGuard,
    ),
    SetMetadata(ABILITY_META_KEY, abilities),
    SetMetadata(SYSTEM_ONLY_META_KEY, systemOnly),
  );
}

export function AuthRefreshJwtGuard(): any {
  return applyDecorators(
    UseGuards(
      JwtRefreshGuard,
      UserPutToRequestGuard,
      ReqUserActiveGuard,
      ReqUserAclRoleActiveGuard,
      ReqUserOrganizationActiveGuard,
    ),
  );
}

export const ReqJwtUser = createParamDecorator(
  (key: string, ctx: ExecutionContext): Record<string, any> => {
    const { user } = ctx.switchToHttp().getRequest();
    return key ? user[key] : user;
  },
);

export const Token = createParamDecorator(
  (data: string, ctx: ExecutionContext): string => {
    const { headers } = ctx.switchToHttp().getRequest();
    const { authorization } = headers;
    return authorization ? authorization.split(' ')[1] : undefined;
  },
);
