import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { ConfigDynamicModule } from '@/config';
import { HelperModule } from '@/utils/helper/helper.module';
import { HelperService } from '@/utils/helper/service/helper.service';

describe('HelperService', () => {
  let helperService: HelperService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HelperModule, ConfigDynamicModule],
      providers: [ConfigService],
    }).compile();

    helperService = moduleRef.get<HelperService>(HelperService);
  });

  it('should be defined', () => {
    expect(helperService).toBeDefined();
  });

  describe('check', () => {
    it('should be called', async () => {
      const test = jest.spyOn(helperService, 'delay');

      await helperService.delay(100);
      expect(test).toHaveBeenCalledWith(100);
    });

    it('should be success', async () => {
      const result = await helperService.delay(100);
      jest.spyOn(helperService, 'delay').mockImplementation(async () => result);

      expect(await helperService.delay(100)).toBe(result);
    });
  });
});
