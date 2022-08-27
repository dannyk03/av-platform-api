import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { NextFunction } from 'express';

import { HelperArrayService } from '@/utils/helper/service';

import { IRequestApp } from '@/utils/request/types';

import { EnumMessageLanguage } from '@/response-message';

@Injectable()
export class ValidateCustomLanguageMiddleware implements NestMiddleware {
  constructor(
    private readonly helperArrayService: HelperArrayService,
    private readonly configService: ConfigService,
  ) {}

  async use(
    req: IRequestApp,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    let language: string = this.configService.get<string>('app.language');
    let customLang: string[] = [language];

    const reqLanguages: string = req.headers['x-custom-lang'] as string;
    const enumLanguage: string[] = Object.values(EnumMessageLanguage);
    if (reqLanguages) {
      const splitLanguage: string[] = reqLanguages
        .split(',')
        .map((val) => val.toLowerCase());
      const uniqueLanguage = this.helperArrayService.unique(splitLanguage);
      const languages: string[] = uniqueLanguage.filter((val) =>
        this.helperArrayService.includes(enumLanguage, val),
      );

      if (languages.length) {
        language = languages.join(',');
        customLang = languages;
      }
    }

    req.headers['x-custom-lang'] = language;
    req.customLang = customLang;

    next();
  }
}
