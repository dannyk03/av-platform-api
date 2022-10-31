import { HttpStatus, INestApplication } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { Test } from '@nestjs/testing';

import { faker } from '@faker-js/faker';
import request from 'supertest';

import { CommonModule } from '@/common/common.module';
import { HealthModule } from '@/health/health.module';

import { HelperDateService } from '@/utils/helper/service';

import { INTEGRATION_CLOUDINARY_URL } from './cloudinary.constant';

import { HealthCommonController } from '@/health/controller';

describe('Cloudinary Integration', () => {
  let app: INestApplication;
  let helperDateService: HelperDateService;
  let timestamp: number;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CommonModule, HealthModule, TerminusModule],
      controllers: [HealthCommonController],
    }).compile();

    app = moduleRef.createNestApplication();
    helperDateService = app.get(HelperDateService);

    timestamp = helperDateService.timestamp();
    await app.init();
  });

  it(`GET ${INTEGRATION_CLOUDINARY_URL} Success`, async () => {
    const response = await request(app.getHttpServer())
      .get(INTEGRATION_CLOUDINARY_URL)
      .set('user-agent', faker.internet.userAgent())
      .set('x-timestamp', timestamp.toString());

    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.body.statusCode).toEqual(HttpStatus.OK);
  });

  afterAll(async () => {
    await app.close();
  });
});
