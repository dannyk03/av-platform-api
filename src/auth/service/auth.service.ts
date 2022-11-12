import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { plainToInstance } from 'class-transformer';

import { User } from '@/user/entity';

import { TwilioService } from '@/messaging/twilio/service';
import {
  HelperDateService,
  HelperEncryptionService,
  HelperHashService,
} from '@/utils/helper/service';

import { IAuthPassword, IAuthPayloadOptions } from '../type';

import { AuthUserLoginSerialization } from '../serialization';

@Injectable()
export class AuthService {
  private readonly accessTokenSecretToken: string =
    this.configService.get<string>('auth.jwt.accessToken.secretKey');
  private readonly accessTokenExpirationTime: string =
    this.configService.get<string>('auth.jwt.accessToken.expirationTime');
  private readonly accessTokenNotBeforeExpirationTime: string =
    this.configService.get<string>(
      'auth.jwt.accessToken.notBeforeExpirationTime',
    );
  private readonly refreshTokenSecretToken: string =
    this.configService.get<string>('auth.jwt.refreshToken.secretKey');
  private readonly refreshTokenExpirationTime: string =
    this.configService.get<string>('auth.jwt.refreshToken.expirationTime');
  private readonly refreshTokenExpirationTimeRememberMe: string =
    this.configService.get<string>(
      'auth.jwt.refreshToken.expirationTimeRememberMe',
    );
  private readonly refreshTokenNotBeforeExpirationTime: string =
    this.configService.get<string>(
      'auth.jwt.refreshToken.notBeforeExpirationTime',
    );

  constructor(
    private readonly helperHashService: HelperHashService,
    private readonly helperDateService: HelperDateService,
    private readonly helperEncryptionService: HelperEncryptionService,
    private readonly configService: ConfigService,
    private readonly twilioService: TwilioService,
  ) {}

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
    test?: boolean,
  ): Promise<string> {
    return this.helperEncryptionService.jwtEncrypt(payload, {
      secretKey: this.refreshTokenSecretToken,
      expiredIn: rememberMe
        ? this.refreshTokenExpirationTimeRememberMe
        : this.refreshTokenExpirationTime,
      notBefore: test ? '0' : this.refreshTokenNotBeforeExpirationTime,
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

  async validateUser(
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

  async serializationLogin(data: User): Promise<AuthUserLoginSerialization> {
    return plainToInstance(AuthUserLoginSerialization, data);
  }

  async createPassword(password: string): Promise<IAuthPassword> {
    const saltLength: number = this.configService.get<number>(
      'auth.password.saltLength',
    );

    const salt: string = this.helperHashService.randomSalt(saltLength);

    const passwordExpiredInMs: number = this.configService.get<number>(
      'auth.password.expiredInMs',
    );
    const passwordExpiredAt: Date =
      this.helperDateService.forwardInMilliseconds(passwordExpiredInMs);
    const passwordHash = this.helperHashService.bcrypt(password, salt);
    return {
      passwordHash,
      passwordExpiredAt,
      salt,
    };
  }

  async checkPasswordExpired(passwordExpired: Date): Promise<boolean> {
    const today: Date = this.helperDateService.create();
    const passwordExpiredConvert: Date = this.helperDateService.create({
      date: passwordExpired,
    });

    if (today > passwordExpiredConvert) {
      return true;
    }

    return false;
  }

  async createVerificationsSmsOPT({ phoneNumber }: { phoneNumber: string }) {
    return this.twilioService.createVerificationsSmsOPT({ phoneNumber });
  }

  async checkVerificationSmsOTP({
    phoneNumber,
    code,
  }: {
    phoneNumber: string;
    code: string;
  }): Promise<boolean> {
    return this.twilioService.checkVerificationSmsOTP({ phoneNumber, code });
  }
}
