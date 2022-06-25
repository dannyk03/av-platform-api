import { Test } from '@nestjs/testing';
import { CoreModule } from 'src/core/core.module';
import { TypeOrmConfigService } from '@/database/service/typeorm-config.service';

describe('DatabaseService', () => {
  let databaseService: TypeOrmConfigService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CoreModule],
    }).compile();

    databaseService = moduleRef.get<TypeOrmConfigService>(TypeOrmConfigService);
  });

  it('should be defined', () => {
    expect(databaseService).toBeDefined();
  });

  describe('createTypeOrmOptions', () => {
    it('should be called', async () => {
      const test = jest.spyOn(databaseService, 'createTypeOrmOptions');

      databaseService.createTypeOrmOptions();
      expect(test).toHaveBeenCalled();
    });

    it('should be success', async () => {
      const options = databaseService.createTypeOrmOptions();
      jest
        .spyOn(databaseService, 'createTypeOrmOptions')
        .mockImplementation(() => options);

      expect(databaseService.createTypeOrmOptions()).toBe(options);
    });
  });
});
