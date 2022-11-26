import { Injectable } from '@nestjs/common';

import { isEmail } from 'class-validator';
import disposableEmailDomains from 'disposable-email-domains';

import { IHelperEmailService } from '../type';

@Injectable()
export class HelperEmailService implements IHelperEmailService {
  private readonly disposableDomainsMap: Map<string, boolean> = new Map(
    disposableEmailDomains.map((k) => [k, true]),
  );

  private isDisposableEmailDomain(email: string): boolean {
    return this.disposableDomainsMap.has(email.split('@')[1]);
  }

  isAcceptableEmail(email: string): boolean {
    return isEmail(email) && !this.isDisposableEmailDomain(email);
  }
}
