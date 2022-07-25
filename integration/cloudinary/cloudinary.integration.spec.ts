// import { HttpStatus, INestApplication } from '@nestjs/common';
// import { TerminusModule } from '@nestjs/terminus';
// import { Test } from '@nestjs/testing';
// import { CoreModule } from '@/core/core.module';
// import { HealthController } from '@/health/controller/health.controller';
// import { HealthModule } from 'src/health/health.module';
// import { HelperDateService } from 'src/utils/helper/service/helper.date.service';
// import request from 'supertest';
// import { faker } from '@faker-js/faker';

// describe('Database Integration', () => {
//   let app: INestApplication;
//   let helperDateService: HelperDateService;
//   let timestamp: number;

//   beforeEach(async () => {
//     const moduleRef = await Test.createTestingModule({
//       imports: [CoreModule, HealthModule, TerminusModule],
//       controllers: [HealthController],
//     }).compile();

//     app = moduleRef.createNestApplication();
//     helperDateService = app.get(HelperDateService);

//     timestamp = helperDateService.timestamp();
//     await app.init();
//   });

//   it(`GET ${INTEGRATION_DATABASE_URL} Success`, async () => {
//     const response = await request(app.getHttpServer())
//       .get(INTEGRATION_DATABASE_URL)
//       .set('user-agent', faker.internet.userAgent())
//       .set('x-timestamp', timestamp.toString());

//     expect(response.status).toEqual(HttpStatus.OK);
//     expect(response.body.statusCode).toEqual(HttpStatus.OK);

//     return;
//   });

//   afterAll(async () => {
//     await app.close();
//   });
// });
