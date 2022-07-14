import { AuthLoginDto, AuthMagicLoginDto } from '../dto';

export function isMagicLogin(
  dto: AuthLoginDto | AuthMagicLoginDto,
): dto is AuthMagicLoginDto {
  return !('password' in dto);
}
