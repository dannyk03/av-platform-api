import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { SHA1, SHA256, enc } from 'crypto-js';
import { customAlphabet, nanoid } from 'nanoid/async';
import { namespace } from 'package.json';
import { v5 as uuidv5 } from 'uuid';

import { IHelperHashService } from '../type/helper.hash-service.interface';

const magicNanoId = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
);

@Injectable()
export class HelperHashService implements IHelperHashService {
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

  sha1(value: string): string {
    return SHA1(value).toString(enc.Hex);
  }

  sha1Compare(hashOne: string, hashTwo: string): boolean {
    console.log({ hashOne, hashTwo });
    return hashOne === hashTwo;
  }

  async nanoId(length?: number): Promise<string> {
    return nanoid(length);
  }

  async magicCode(): Promise<string> {
    return magicNanoId();
  }

  async uuidV5(value: string): Promise<string> {
    return uuidv5(value, namespace);
  }
}
