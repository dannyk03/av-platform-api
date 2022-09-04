import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';

import { UserLoginPutToRequestGuard } from './login/login-active.guard';
import { AuthPayloadPasswordExpiredGuard } from './payload/auth.password-expired.guard';
import { AclAbilityGuard } from '@/access-control-list/ability/guard';
import { ReqUserAclRoleActiveGuard } from '@/access-control-list/role/guard';
import { ReqUserOrganizationActiveGuard } from '@/organization/guard';
import {
  ReqUserActiveGuard,
  ReqUserSystemOnlyGuard,
  ReqUserVerifiedOnlyGuard,
  UserPutToRequestGuard,
} from '@/user/guard';

import { IAclGuard } from '../type';
import { IReqAclAbility } from '@/access-control-list/type';

import { ABILITY_META_KEY } from '@/access-control-list/ability/constant';
import { SYSTEM_ONLY_META_KEY } from '@/system/constant';
import {
  USER_LOAD_AUTH_SENSITIVE_DATA_META_KEY,
  USER_RELATIONS_META_KEY,
  USER_VERIFIED_ONLY_META_KEY,
} from '@/user/constant';

import { JwtGuard } from './jwt';
import { JwtRefreshGuard } from './jwt-refresh';
import { JwtOptionalGuard } from './optional';

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
