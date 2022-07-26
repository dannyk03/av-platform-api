import { ConfigDynamicModule } from '$/config';
import { HelperModule } from '$/utils/helper/helper.module';
import { HelperFileService } from '$/utils/helper/service/helper.file.service';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

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

  describe('writeExcel', () => {
    it('should be called', async () => {
      const test = jest.spyOn(helperFileService, 'writeExcel');

      helperFileService.writeExcel([], []);
      expect(test).toHaveBeenCalledWith([], []);
    });

    it('should be success', async () => {
      const result = helperFileService.writeExcel([], []);
      jest
        .spyOn(helperFileService, 'writeExcel')
        .mockImplementation(() => result);

      expect(helperFileService.writeExcel([], [])).toBe(result);
    });
  });
});
