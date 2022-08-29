import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import MaskData from 'maskdata';

const maskPasswordOptions = {
  maskWith: 'X',
  maxMaskedCharacters: 20, // To limit the output String length to 20.
  unmaskedStartCharacters: 4,
  unmaskedEndCharacters: 9, // As last 9 characters of the secret key is a meta info which can be printed for debugging or other purpose
};

@Injectable()
export class HelperMaskService {
  constructor(private readonly configService: ConfigService) {}
}
