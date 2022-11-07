import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IErrors, IMessage } from '@avo/type';

import { ValidationError } from 'class-validator';
import { I18nService } from 'nestjs-i18n';

import { IErrorsImport, IValidationErrorImport } from '@/utils/error/type';

import {
  IMessageOptions,
  IMessageSetOptions,
} from '../response-message.interface';

@Injectable()
export class ResponseMessageService {
  private readonly defaultLanguage: string;

  constructor(
    private readonly i18n: I18nService,
    private readonly configService: ConfigService,
  ) {
    this.defaultLanguage = this.configService.get<string>('app.language');
  }

  private setMessage(
    lang: string,
    key: string,
    options?: IMessageSetOptions,
  ): any {
    return this.i18n.translate(key, {
      lang: lang || this.defaultLanguage,
      args: options?.properties,
    });
  }

  async getRequestErrorsMessage(
    requestErrors: ValidationError[],
    customLanguages?: string[],
  ): Promise<IErrors[]> {
    const messages: Array<IErrors[]> = [];
    for (const transfomer of requestErrors) {
      let children: Record<string, any>[] = transfomer.children;
      let constraints: string[] = Object.keys(transfomer.constraints || []);
      const errors: IErrors[] = [];
      let property: string = transfomer.property;
      let propertyValue: string = transfomer.value;

      if (children?.length) {
        while (children?.length) {
          for (const child of children) {
            property = `${property}.${child.property}`;

            if (child?.children?.length) {
              children = child.children;
              break;
            } else if (child.constraints) {
              constraints = Object.keys(child.constraints);
              children = [];
              propertyValue = child.value;
              break;
            }
          }
        }
      }

      for (const constraint of constraints) {
        const message = await this.get(`request.${constraint}`, {
          customLanguages,
          properties: {
            property,
            value: propertyValue,
          },
        });
        errors.push({
          property,
          message,
        });
      }

      messages.push(errors);
    }

    return messages.flat(1) as IErrors[];
  }

  async getImportErrorsMessage(
    errors: IValidationErrorImport[],
    customLanguages?: string[],
  ): Promise<IErrorsImport[]> {
    const newErrors: IErrorsImport[] = [];
    for (const error of errors) {
      newErrors.push({
        row: error.row,
        file: error.file,
        errors: await this.getRequestErrorsMessage(
          error.errors,
          customLanguages,
        ),
      });
    }

    return newErrors;
  }

  async get(
    key: string,
    options?: IMessageOptions,
  ): Promise<string | IMessage> {
    const properties = options?.properties;
    const customLanguages = options?.customLanguages?.length
      ? options.customLanguages
      : [this.defaultLanguage];

    const messages: IMessage = {};
    for (const customLanguage of customLanguages) {
      messages[customLanguage] = await this.setMessage(customLanguage, key, {
        properties,
      });
    }

    if (customLanguages.length <= 1) {
      return messages[customLanguages[0]];
    }

    return messages;
  }
}
