import { Injectable } from '@nestjs/common';

import { isEmail } from 'class-validator';
import disposableEmailDomains from 'disposable-email-domains';
import freeEmailDomains from 'free-email-domains';

import { IHelperEmailService } from '../type';

@Injectable()
export class HelperEmailService implements IHelperEmailService {
  private readonly disposableDomainsMap: Map<string, boolean> = new Map(
    disposableEmailDomains.map((k) => [k, true]),
  );

  private readonly freeDomainsMap: Map<string, boolean> = new Map(
    freeEmailDomains.map((k) => [k, true]),
  );

  private isDisposableEmailDomain(email: string): boolean {
    return this.disposableDomainsMap.has(email.split('@')[1]);
  }

  private isFreeEmailDomain(email: string): boolean {
    return this.freeDomainsMap.has(email.split('@')[1]);
  }

  isAcceptableEmail(email: string): boolean {
    const xxx = isEmail(email);
    const xxx1 = isEmail(this.isDisposableEmailDomain(email));
    const xxx2 = isEmail(this.isFreeEmailDomain(email));

    return (
      isEmail(email) &&
      !this.isDisposableEmailDomain(email) &&
      !this.isFreeEmailDomain(email)
    );
  }
}
