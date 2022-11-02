import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HelperAppService {
  private readonly isProduction = this.configService.get('app.isProduction');
  private readonly isStaging = this.configService.get('app.isStaging');

  constructor(private readonly configService: ConfigService) {}
  async getAppUrl(): Promise<string> {
    if (this.isProduction) {
      return 'https://platform-api.us.prod.avoc.io/';
    }

    if (this.isStaging) {
      return 'https://platform-api.us.stg.avoc.io/';
    }

    // Use ngrok for local debugging
    // return 'http://c85e-169-150-226-246.eu.ngrok.io';
  }
}
