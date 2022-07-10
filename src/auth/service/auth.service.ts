import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { IUserEntity } from '@/user/user.interface';
import { HelperDateService } from '@/utils/helper/service/helper.date.service';
import { HelperEncryptionService } from '@/utils/helper/service/helper.encryption.service';
import { HelperHashService } from '@/utils/helper/service/helper.hash.service';
import { IAuthPassword, IAuthPayloadOptions } from '../auth.interface';
import { AuthLoginDto } from '../dto/auth.login.dto';
import { AuthUserLoginSerialization } from '../serialization/auth-user.login.serialization';

@Injectable()
export class AuthService {
  private readonly accessTokenSecretToken: string;
  private readonly accessTokenExpirationTime: string;
  private readonly accessTokenNotBeforeExpirationTime: string;

  private readonly refreshTokenSecretToken: string;
  private readonly refreshTokenExpirationTime: string;
  private readonly refreshTokenExpirationTimeRememberMe: string;
  private readonly refreshTokenNotBeforeExpirationTime: string;

  constructor(
    private readonly helperHashService: HelperHashService,
    private readonly helperDateService: HelperDateService,
    private readonly helperEncryptionService: HelperEncryptionService,
    private readonly configService: ConfigService,
  ) {
    this.accessTokenSecretToken = this.configService.get<string>(
      'auth.jwt.accessToken.secretKey',
    );
    this.accessTokenExpirationTime = this.configService.get<string>(
      'auth.jwt.accessToken.expirationTime',
    );
    this.accessTokenNotBeforeExpirationTime = this.configService.get<string>(
      'auth.jwt.accessToken.notBeforeExpirationTime',
    );

    this.refreshTokenSecretToken = this.configService.get<string>(
      'auth.jwt.refreshToken.secretKey',
    );
    this.refreshTokenExpirationTime = this.configService.get<string>(
      'auth.jwt.refreshToken.expirationTime',
    );
    this.refreshTokenExpirationTimeRememberMe = this.configService.get<string>(
      'auth.jwt.refreshToken.expirationTimeRememberMe',
    );
    this.refreshTokenNotBeforeExpirationTime = this.configService.get<string>(
      'auth.jwt.refreshToken.notBeforeExpirationTime',
    );
  }

  async createAccessToken(payload: Record<string, any>): Promise<string> {
    return this.helperEncryptionService.jwtEncrypt(payload, {
      secretKey: this.accessTokenSecretToken,
      expiredIn: this.accessTokenExpirationTime,
      notBefore: this.accessTokenNotBeforeExpirationTime,
    });
  }

  async validateAccessToken(token: string): Promise<boolean> {
    return this.helperEncryptionService.jwtVerify(token, {
      secretKey: this.accessTokenSecretToken,
    });
  }

  async payloadAccessToken(token: string): Promise<Record<string, any>> {
    return this.helperEncryptionService.jwtDecrypt(token);
  }

  async createRefreshToken(
    payload: Record<string, any>,
    rememberMe: boolean,
    isTest?: boolean,
  ): Promise<string> {
    return this.helperEncryptionService.jwtEncrypt(payload, {
      secretKey: this.refreshTokenSecretToken,
      expiredIn: rememberMe
        ? this.refreshTokenExpirationTimeRememberMe
        : this.refreshTokenExpirationTime,
      notBefore: isTest ? '0' : this.refreshTokenNotBeforeExpirationTime,
    });
  }

  async validateRefreshToken(token: string): Promise<boolean> {
    return this.helperEncryptionService.jwtVerify(token, {
      secretKey: this.refreshTokenSecretToken,
    });
  }

  async payloadRefreshToken(token: string): Promise<Record<string, any>> {
    return this.helperEncryptionService.jwtDecrypt(token);
  }

  async validateUserPassword(
    passwordString: string,
    passwordHash: string,
  ): Promise<boolean> {
    return this.helperHashService.bcryptCompare(passwordString, passwordHash);
  }

  async createPayloadAccessToken(
    data: Record<string, any>,
    rememberMe: boolean,
    options?: IAuthPayloadOptions,
  ): Promise<Record<string, any>> {
    return {
      ...data,
      rememberMe,
      loginDate: options?.loginDate || this.helperDateService.create(),
    };
  }

  async createPayloadRefreshToken(
    { id }: AuthUserLoginSerialization,
    rememberMe: boolean,
    options?: IAuthPayloadOptions,
  ): Promise<Record<string, any>> {
    return {
      id,
      rememberMe,
      loginDate: options?.loginDate,
    };
  }

  async serializationLogin(
    data: IUserEntity,
  ): Promise<AuthUserLoginSerialization> {
    return plainToInstance(AuthUserLoginSerialization, data);
  }

  async createPassword(password: string): Promise<IAuthPassword> {
    const saltLength: number = this.configService.get<number>(
      'auth.password.saltLength',
    );

    const salt: string = this.helperHashService.randomSalt(saltLength);

    const passwordExpiredInDays: number = this.configService.get<number>(
      'auth.password.expiredInDay',
    );
    const passwordExpiredAt: Date = this.helperDateService.forwardInDays(
      passwordExpiredInDays,
    );
    const passwordHash = this.helperHashService.bcrypt(password, salt);
    return {
      passwordHash,
      passwordExpiredAt,
      salt,
    };
  }
}
