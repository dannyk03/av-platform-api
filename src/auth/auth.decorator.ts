import {
  UseGuards,
  createParamDecorator,
  ExecutionContext,
  applyDecorators,
  SetMetadata,
} from '@nestjs/common';
import { PermissionPayloadDefaultGuard } from '@acl/ability/guard';
import { PERMISSION_META_KEY } from '@acl/ability/acl-ability.constant';
import { AUTH_ADMIN_META_KEY } from './auth.constant';
import { JwtRefreshGuard } from './guard/jwt-refresh/auth.jwt-refresh.guard';
import { JwtGuard } from './guard/jwt/auth.jwt.guard';
import { AuthPayloadAdminGuard } from './guard/payload/auth.payload.admin.guard';
import { AuthPayloadDefaultGuard } from './guard/payload/auth.payload.default.guard';
import { AuthPayloadPasswordExpiredGuard } from './guard/payload/auth.payload.password-expired.guard';

type ENUM_PERMISSIONS = 'temp-stub';

export function AuthJwtGuard(...permissions: ENUM_PERMISSIONS[]): any {
  return applyDecorators(
    UseGuards(JwtGuard, AuthPayloadDefaultGuard, PermissionPayloadDefaultGuard),
    SetMetadata(PERMISSION_META_KEY, permissions),
  );
}

export function AuthPublicJwtGuard(...permissions: ENUM_PERMISSIONS[]): any {
  return applyDecorators(
    UseGuards(
      JwtGuard,
      AuthPayloadDefaultGuard,
      AuthPayloadPasswordExpiredGuard,
      AuthPayloadAdminGuard,
      PermissionPayloadDefaultGuard,
    ),
    SetMetadata(PERMISSION_META_KEY, permissions),
    SetMetadata(AUTH_ADMIN_META_KEY, [false]),
  );
}

export function AuthAdminJwtGuard(...permissions: ENUM_PERMISSIONS[]) {
  return applyDecorators(
    UseGuards(
      JwtGuard,
      AuthPayloadDefaultGuard,
      AuthPayloadPasswordExpiredGuard,
      AuthPayloadAdminGuard,
      PermissionPayloadDefaultGuard,
    ),
    SetMetadata(PERMISSION_META_KEY, permissions),
    SetMetadata(AUTH_ADMIN_META_KEY, [true]),
  );
}

export function AuthRefreshJwtGuard(): any {
  return applyDecorators(UseGuards(JwtRefreshGuard));
}

export const ReqUser = createParamDecorator(
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
