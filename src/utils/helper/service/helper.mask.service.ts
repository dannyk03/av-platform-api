import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { isEmpty, isNumber, isString } from 'class-validator';
import cloneDeep from 'lodash/cloneDeep';
import MaskData from 'maskdata';

import { ILogMask } from '@/log/type';

const maskPasswordOptions = {
  maskWith: '*',
  maxMaskedCharacters: 5,
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

const maskCardOptions = {
  maskWith: 'X',
  unmaskedStartDigits: 4,
  unmaskedEndDigits: 1,
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
      if (value && (isString(value) || isNumber(value))) {
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
      emailStrategyFields,
      passwordStrategyFields,
      creditCardStrategyFields,
      phoneNumberStrategyFields,
      jsonStrategyFields,
    } = options;

    const deepCopyBody = cloneDeep(body);

    if (passwordStrategyFields?.length) {
      this.maskStrategy({
        target: deepCopyBody,
        fields: passwordStrategyFields,
        maskOptions: maskPasswordOptions,
        maskFunc: MaskData.maskPassword,
      });
    }

    if (emailStrategyFields?.length) {
      this.maskStrategy({
        target: deepCopyBody,
        fields: emailStrategyFields,
        maskOptions: emailMask2Options,
        maskFunc: MaskData.maskEmail2,
      });
    }

    if (creditCardStrategyFields?.length) {
      this.maskStrategy({
        target: deepCopyBody,
        fields: creditCardStrategyFields,
        maskOptions: maskCardOptions,
        maskFunc: MaskData.maskCard,
      });
    }
    if (phoneNumberStrategyFields?.length) {
      this.maskStrategy({
        target: deepCopyBody,
        fields: phoneNumberStrategyFields,
        maskOptions: maskPhoneOptions,
        maskFunc: MaskData.maskPhone,
      });
    }

    if (jsonStrategyFields?.length) {
      const isTuple =
        Number.isInteger(jsonStrategyFields[0]) &&
        Array.isArray(jsonStrategyFields[1]);

      const unmaskPadding = jsonStrategyFields[0];

      return MaskData.maskJSONFields(deepCopyBody, {
        maskWith: '*',
        fields: isTuple ? jsonStrategyFields[1] : jsonStrategyFields,
        ...(isTuple
          ? {
              unmaskedStartCharacters: unmaskPadding,
              unmaskedEndCharacters: unmaskPadding,
            }
          : { maxMaskedCharactersStr: 5 }),
      });
    }

    return deepCopyBody;
  }
}
