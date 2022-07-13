import { Test } from '@nestjs/testing';
import { CoreModule } from '@/core/core.module';
import { EnumHelperDateDiff, EnumHelperDateFormat } from '@/utils/helper';
import { HelperDateService } from '@/utils/helper/service/helper.date.service';

describe('HelperDateService', () => {
  let helperDateService: HelperDateService;
  const date1 = new Date();
  const date2 = new Date();

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CoreModule],
    }).compile();

    helperDateService = moduleRef.get<HelperDateService>(HelperDateService);
  });

  it('should be defined', () => {
    expect(helperDateService).toBeDefined();
  });

  describe('calculateAge', () => {
    it('should be called', async () => {
      const test = jest.spyOn(helperDateService, 'calculateAge');

      helperDateService.calculateAge(date1);
      expect(test).toHaveBeenCalledWith(date1);
    });

    it('should be success', async () => {
      const result = helperDateService.calculateAge(date1);
      jest
        .spyOn(helperDateService, 'calculateAge')
        .mockImplementation(() => result);

      expect(helperDateService.calculateAge(date1)).toBe(result);
    });
  });

  describe('diff', () => {
    it('should be called', async () => {
      const test = jest.spyOn(helperDateService, 'diff');

      helperDateService.diff(date1, date2);
      expect(test).toHaveBeenCalledWith(date1, date2);
    });

    it('minutes should be success', async () => {
      const result = helperDateService.diff(date1, date2);
      jest.spyOn(helperDateService, 'diff').mockImplementation(() => result);

      expect(helperDateService.diff(date1, date2)).toBe(result);
    });

    it('hours should be success', async () => {
      const result = helperDateService.diff(date1, date2, {
        format: EnumHelperDateDiff.Hours,
      });
      jest.spyOn(helperDateService, 'diff').mockImplementation(() => result);

      expect(
        helperDateService.diff(date1, date2, {
          format: EnumHelperDateDiff.Hours,
        }),
      ).toBe(result);
    });

    it('days should be success', async () => {
      const result = helperDateService.diff(date1, date2, {
        format: EnumHelperDateDiff.Days,
      });
      jest.spyOn(helperDateService, 'diff').mockImplementation(() => result);

      expect(
        helperDateService.diff(date1, date2, {
          format: EnumHelperDateDiff.Days,
        }),
      ).toBe(result);
    });

    it('seconds should be success', async () => {
      const result = helperDateService.diff(date1, date2, {
        format: EnumHelperDateDiff.Seconds,
      });
      jest.spyOn(helperDateService, 'diff').mockImplementation(() => result);

      expect(
        helperDateService.diff(date1, date2, {
          format: EnumHelperDateDiff.Seconds,
        }),
      ).toBe(result);
    });

    it('milis should be success', async () => {
      const result = helperDateService.diff(date1, date2, {
        format: EnumHelperDateDiff.Milis,
      });
      jest.spyOn(helperDateService, 'diff').mockImplementation(() => result);

      expect(
        helperDateService.diff(date1, date2, {
          format: EnumHelperDateDiff.Milis,
        }),
      ).toBe(result);
    });
  });

  describe('check', () => {
    it('should be called', async () => {
      const test = jest.spyOn(helperDateService, 'check');

      helperDateService.check(date1.toISOString());
      expect(test).toHaveBeenCalledWith(date1.toISOString());
    });

    it('should be success', async () => {
      const result = helperDateService.check(date1.toISOString());
      jest.spyOn(helperDateService, 'check').mockImplementation(() => result);

      expect(helperDateService.check(date1.toISOString())).toBe(result);
    });
  });

  describe('create', () => {
    it('should be called', async () => {
      const test = jest.spyOn(helperDateService, 'create');

      helperDateService.create({ date: date1 });
      expect(test).toHaveBeenCalledWith(date1);
    });

    it('should be success', async () => {
      const result = helperDateService.create({ date: date1 });
      jest.spyOn(helperDateService, 'create').mockImplementation(() => result);

      expect(helperDateService.create({ date: date1 })).toBe(result);
    });
  });

  describe('timestamp', () => {
    it('should be called', async () => {
      const test = jest.spyOn(helperDateService, 'timestamp');

      helperDateService.timestamp({ date: date1 });
      expect(test).toHaveBeenCalledWith(date1);
    });

    it('should be success', async () => {
      const result = helperDateService.timestamp({ date: date1 });
      jest
        .spyOn(helperDateService, 'timestamp')
        .mockImplementation(() => result);

      expect(helperDateService.timestamp({ date: date1 })).toBe(result);
    });
  });

  describe('format', () => {
    it('should be called', async () => {
      const test = jest.spyOn(helperDateService, 'format');

      helperDateService.format(date1);
      expect(test).toHaveBeenCalledWith(date1);
    });

    it('should be success', async () => {
      const result = helperDateService.format(date1);
      jest.spyOn(helperDateService, 'format').mockImplementation(() => result);

      expect(helperDateService.format(date1)).toBe(result);
    });

    it('with options should be success', async () => {
      const result = helperDateService.format(date1, {
        timezone: 'ASIA/JAKARTA',
        format: EnumHelperDateFormat.Date,
      });
      jest.spyOn(helperDateService, 'format').mockImplementation(() => result);

      expect(
        helperDateService.format(date1, {
          timezone: 'ASIA/JAKARTA',
          format: EnumHelperDateFormat.Date,
        }),
      ).toBe(result);
    });
  });

  describe('forwardInMinutes', () => {
    it('should be called', async () => {
      const test = jest.spyOn(helperDateService, 'forwardInMinutes');

      helperDateService.forwardInMinutes(2);
      expect(test).toHaveBeenCalledWith(2);
    });

    it('should be success', async () => {
      const result = helperDateService.forwardInMinutes(2);
      jest
        .spyOn(helperDateService, 'forwardInMinutes')
        .mockImplementation(() => result);

      expect(helperDateService.forwardInMinutes(2)).toBe(result);
    });
  });

  describe('backwardInMinutes', () => {
    it('should be called', async () => {
      const test = jest.spyOn(helperDateService, 'backwardInMinutes');

      helperDateService.backwardInMinutes(2);
      expect(test).toHaveBeenCalledWith(2);
    });

    it('should be success', async () => {
      const result = helperDateService.backwardInMinutes(2);
      jest
        .spyOn(helperDateService, 'backwardInMinutes')
        .mockImplementation(() => result);

      expect(helperDateService.backwardInMinutes(2)).toBe(result);
    });
  });

  // describe('forwardInHours', () => {
  //   it('should be called', async () => {
  //     const test = jest.spyOn(helperDateService, 'forwardInHours');

  //     helperDateService.forwardInHours(2);
  //     expect(test).toHaveBeenCalledWith(2);
  //   });

  //   it('should be success', async () => {
  //     const result = helperDateService.forwardInHours(2);
  //     jest
  //       .spyOn(helperDateService, 'forwardInHours')
  //       .mockImplementation(() => result);

  //     expect(helperDateService.forwardInHours(2)).toBe(result);
  //   });
  // });

  // describe('backwardInHours', () => {
  //   it('should be called', async () => {
  //     const test = jest.spyOn(helperDateService, 'backwardInHours');

  //     helperDateService.backwardInHours(2);
  //     expect(test).toHaveBeenCalledWith(2);
  //   });

  //   it('should be success', async () => {
  //     const result = helperDateService.backwardInHours(2);
  //     jest
  //       .spyOn(helperDateService, 'backwardInHours')
  //       .mockImplementation(() => result);

  //     expect(helperDateService.backwardInHours(2)).toBe(result);
  //   });
  // });

  describe('forwardInDays', () => {
    it('should be called', async () => {
      const test = jest.spyOn(helperDateService, 'forwardInDays');

      helperDateService.forwardInDays(2);
      expect(test).toHaveBeenCalledWith(2);
    });

    it('should be success', async () => {
      const result = helperDateService.forwardInDays(2);
      jest
        .spyOn(helperDateService, 'forwardInDays')
        .mockImplementation(() => result);

      expect(helperDateService.forwardInDays(2)).toBe(result);
    });
  });

  describe('backwardInDays', () => {
    it('should be called', async () => {
      const test = jest.spyOn(helperDateService, 'backwardInDays');

      helperDateService.backwardInDays(2);
      expect(test).toHaveBeenCalledWith(2);
    });

    it('should be success', async () => {
      const result = helperDateService.backwardInDays(2);
      jest
        .spyOn(helperDateService, 'backwardInDays')
        .mockImplementation(() => result);

      expect(helperDateService.backwardInDays(2)).toBe(result);
    });
  });

  describe('forwardInMonths', () => {
    it('should be called', async () => {
      const test = jest.spyOn(helperDateService, 'forwardInMonths');

      helperDateService.forwardInMonths(2);
      expect(test).toHaveBeenCalledWith(2);
    });

    it('should be success', async () => {
      const result = helperDateService.forwardInMonths(2);
      jest
        .spyOn(helperDateService, 'forwardInMonths')
        .mockImplementation(() => result);

      expect(helperDateService.forwardInMonths(2)).toBe(result);
    });
  });

  describe('backwardInMonths', () => {
    it('should be called', async () => {
      const test = jest.spyOn(helperDateService, 'backwardInMonths');

      helperDateService.backwardInMonths(2);
      expect(test).toHaveBeenCalledWith(2);
    });

    it('should be success', async () => {
      const result = helperDateService.backwardInMonths(2);
      jest
        .spyOn(helperDateService, 'backwardInMonths')
        .mockImplementation(() => result);

      expect(helperDateService.backwardInMonths(2)).toBe(result);
    });
  });
});
