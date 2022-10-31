import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { HelperModule } from '@/utils/helper/helper.module';

import { HelperFileService } from '@/utils/helper/service';

import { ConfigDynamicModule } from '@/config';

describe('HelperFileService', () => {
  let helperFileService: HelperFileService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HelperModule, ConfigDynamicModule],
      providers: [ConfigService],
    }).compile();

    helperFileService = moduleRef.get<HelperFileService>(HelperFileService);
  });

  it('should be defined', () => {
    expect(helperFileService).toBeDefined();
  });

  describe('convertToBytes', () => {
    it('should be called', async () => {
      const result = jest.spyOn(helperFileService, 'convertToBytes');

      helperFileService.convertToBytes('1mb');
      expect(result).toHaveBeenCalledWith('1mb');
    });

    it('should be success', async () => {
      const result = helperFileService.convertToBytes('1mb');
      jest
        .spyOn(helperFileService, 'convertToBytes')
        .mockImplementation(() => result);

      expect(helperFileService.convertToBytes('1mb')).toBe(result);
    });
  });
});
