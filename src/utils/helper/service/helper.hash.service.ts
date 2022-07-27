import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { SHA256, enc } from 'crypto-js';
import { customAlphabet, nanoid } from 'nanoid/async';

const magicNanoId = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
);

@Injectable()
export class HelperHashService {
  constructor(private readonly configService: ConfigService) {}

  randomSalt(length?: number): string {
    return genSaltSync(
      length || this.configService.get<number>('helper.salt.length'),
    );
  }

  bcrypt(passwordString: string, salt: string): string {
    return hashSync(passwordString, salt);
  }

  bcryptCompare(passwordString: string, passwordHashed: string): boolean {
    return compareSync(passwordString, passwordHashed);
  }

  sha256(string: string): string {
    return SHA256(string).toString(enc.Hex);
  }

  sha256Compare(hashOne: string, hashTwo: string): boolean {
    return hashOne === hashTwo;
  }

  async nanoId(length?: number): Promise<string> {
    return nanoid(length);
  }

  async magicCode(): Promise<string> {
    return magicNanoId();
  }
}
