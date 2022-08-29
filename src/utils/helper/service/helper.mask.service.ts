import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { isEmpty, isObject } from 'class-validator';
import cloneDeep from 'lodash/cloneDeep';
import MaskData from 'maskdata';

import { ILogMask } from '@/log/type';

const maskPasswordOptions = {
  maskWith: '*',
  maxMaskedCharacters: 10,
  unmaskedStartCharacters: 0,
  unmaskedEndCharacters: 0,
};

const maskPhoneOptions = {
  maskWith: '*',
  unmaskedStartDigits: 5,
  unmaskedEndDigits: 1,
};

const emailMask2Options = {
  maskWith: '*',
  unmaskedStartCharactersBeforeAt: 2,
  unmaskedEndCharactersAfterAt: 15,
  maskAtTheRate: false,
};

@Injectable()
export class HelperMaskService {
  constructor(private readonly configService: ConfigService) {}

  private maskStrategy({
    target,
    fields,
    maskOptions,
    maskFunc,
  }: {
    target: Record<string, any>;
    fields: string[];
    maskOptions: Record<string, any>;
    maskFunc: (value: string, maskOptions: Record<string, any>) => string;
  }) {
    return fields.reduce((acc, curr) => {
      const value = MaskData.getInnerProperty(acc, curr);
      if (value && !isObject(value)) {
        MaskData.replaceValue(acc, curr, maskFunc(String(value), maskOptions));
      }
      return acc;
    }, target);
  }

  async maskBody({
    body,
    options,
  }: {
    body: Record<string, any>;
    options: ILogMask;
  }): Promise<Record<string, any>> {
    if (!options || isEmpty(body)) {
      return body;
    }

    const {
      basicStrategyFields,
      emailStrategyFields,
      passwordStrategyFields,
      creditCardStrategyFields,
    } = options;

    const deepCopyBody = cloneDeep(body);

    if (passwordStrategyFields) {
      this.maskStrategy({
        target: deepCopyBody,
        fields: passwordStrategyFields,
        maskOptions: maskPasswordOptions,
        maskFunc: MaskData.maskPassword,
      });
    }

    if (emailStrategyFields) {
      this.maskStrategy({
        target: deepCopyBody,
        fields: emailStrategyFields,
        maskOptions: emailMask2Options,
        maskFunc: MaskData.maskEmail2,
      });
    }

    return deepCopyBody;
  }
}
