import { HttpStatus, INestApplication } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { Test } from '@nestjs/testing';

import { faker } from '@faker-js/faker';
import request from 'supertest';

import { CommonModule } from '@/common/common.module';
import { HealthModule } from '@/health/health.module';

import { HelperDateService } from '@/utils/helper/service/helper.date.service';

import { INTEGRATION_DATABASE_URL } from './database.constant';

import { HealthCommonController } from '@/health/controller/health.common.controller';

describe('Database Integration', () => {
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

  it(`GET ${INTEGRATION_DATABASE_URL} Success`, async () => {
    const response = await request(app.getHttpServer())
      .get(INTEGRATION_DATABASE_URL)
      .set('user-agent', faker.internet.userAgent())
      .set('x-timestamp', timestamp.toString());

    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.body.statusCode).toEqual(HttpStatus.OK);
  });

  afterAll(async () => {
    await app.close();
  });
});
