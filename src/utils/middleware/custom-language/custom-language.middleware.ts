import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { NextFunction, Response } from 'express';

import { ResponseMessageService } from '@/response-message/service';
import { HelperArrayService } from '@/utils/helper/service/helper.array.service';

import { IRequestApp } from '@/utils/request';

@Injectable()
export class CustomLanguageMiddleware implements NestMiddleware {
  constructor(
    private readonly responseMessageService: ResponseMessageService,
    private readonly helperArrayService: HelperArrayService,
    private readonly configService: ConfigService,
  ) {}

  async use(
    req: IRequestApp,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    let language: string = this.configService.get<string>('app.language');
    const reqLanguages: string = req.headers['x-custom-lang'] as string;
    const enumLanguage: string[] = Object.values(
      await this.responseMessageService.getLanguages(),
    );
    if (reqLanguages) {
      const languages: string[] = this.helperArrayService.unique(
        reqLanguages
          .split(',')
          .filter((val) => this.helperArrayService.includes(enumLanguage, val)),
      );

      if (languages.length > 0) {
        language = languages.join(',');
      }
    }

    req.headers['x-custom-lang'] = language;
    req.customLang = language;

    next();
  }
}
