import {
  ExecutionContext,
  SetMetadata,
  UseGuards,
  applyDecorators,
  createParamDecorator,
} from '@nestjs/common';

import { ABILITY_META_KEY } from '@acl/ability';
import { AclAbilityGuard } from '@acl/ability/guard';
import { ReqUserAclRoleActiveGuard } from '@acl/role/guard';

import { AuthUserLoginSerialization } from './serialization';

import { IAclGuard } from './auth.interface';
import { IReqAclAbility } from '@acl/acl.interface';

// Guards
import { ReqUserOrganizationActiveGuard } from '@/organization/guard';
import { SYSTEM_ONLY_META_KEY } from '@/system';
import {
  USER_LOAD_AUTH_SENSITIVE_DATA_META_KEY,
  USER_RELATIONS_META_KEY,
  USER_VERIFIED_ONLY_META_KEY,
} from '@/user';
import {
  ReqUserActiveGuard,
  ReqUserSystemOnlyGuard,
  ReqUserVerifiedOnlyGuard,
  UserPutToRequestGuard,
} from '@/user/guard';

import { JwtRefreshGuard } from './guard/jwt-refresh/auth.jwt-refresh.guard';
import { JwtGuard } from './guard/jwt/auth.jwt.guard';
import { UserLoginPutToRequestGuard } from './guard/login/login-active.guard';
import { JwtOptionalGuard } from './guard/optional';
import { AuthPayloadPasswordExpiredGuard } from './guard/payload/auth.password-expired.guard';

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
export function AuthLogoutGuard(): any {
  return applyDecorators(UseGuards(JwtGuard, UserPutToRequestGuard));
}

export function AclGuard(
  {
    abilities = [],
    systemOnly = false,
    verifiedOnly = true,
    relations = [],
    loadSensitiveAuthData = false,
  }: IAclGuard = {
    systemOnly: false,
    verifiedOnly: true,
    relations: [],
    abilities: [],
    loadSensitiveAuthData: false,
  },
) {
  return applyDecorators(
    UseGuards(
      JwtGuard,
      UserPutToRequestGuard,
      ReqUserActiveGuard,
      ReqUserAclRoleActiveGuard,
      ReqUserOrganizationActiveGuard,
      AuthPayloadPasswordExpiredGuard,
      ReqUserVerifiedOnlyGuard,
      ReqUserSystemOnlyGuard,
      AclAbilityGuard,
    ),
    SetMetadata(ABILITY_META_KEY, abilities),
    SetMetadata(SYSTEM_ONLY_META_KEY, systemOnly),
    SetMetadata(USER_VERIFIED_ONLY_META_KEY, verifiedOnly),
    SetMetadata(USER_RELATIONS_META_KEY, relations),
    SetMetadata(USER_LOAD_AUTH_SENSITIVE_DATA_META_KEY, loadSensitiveAuthData),
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
      ReqUserVerifiedOnlyGuard,
    ),
    SetMetadata(USER_VERIFIED_ONLY_META_KEY, true),
  );
}

export const ReqJwtUser = createParamDecorator(
  (key: string, ctx: ExecutionContext): AuthUserLoginSerialization => {
    const { user } = ctx.switchToHttp().getRequest();
    return key ? user[key] : user;
  },
);

export function LoginGuard(): any {
  return applyDecorators(
    UseGuards(
      JwtOptionalGuard,
      UserLoginPutToRequestGuard,
      ReqUserActiveGuard,
      ReqUserAclRoleActiveGuard,
      ReqUserOrganizationActiveGuard,
    ),
  );
}

export const Token = createParamDecorator(
  (_data: string, ctx: ExecutionContext): string => {
    const { headers } = ctx.switchToHttp().getRequest();
    const { authorization } = headers;
    return authorization ? authorization.split(' ')[1] : undefined;
  },
);
