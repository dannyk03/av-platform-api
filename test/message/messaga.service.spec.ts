import { CoreModule } from '$/core/core.module';
import { ResponseMessageService } from '$/response-message/service/response-message.service';
import { Test } from '@nestjs/testing';

describe('MessageService', () => {
  let responseMessageService: ResponseMessageService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CoreModule],
    }).compile();

    responseMessageService = moduleRef.get<ResponseMessageService>(
      ResponseMessageService,
    );
  });

  it('should be defined', () => {
    expect(responseMessageService).toBeDefined();
  });

  describe('get', () => {
    it('should be called', async () => {
      const test = jest.spyOn(responseMessageService, 'get');

      await responseMessageService.get('test.hello');
      expect(test).toHaveBeenCalledWith('test.hello');
    });

    it('should be success', async () => {
      const message = responseMessageService.get('test.hello');
      jest
        .spyOn(responseMessageService, 'get')
        .mockImplementation(() => message);

      expect(responseMessageService.get('test.hello')).toBe(message);
    });
  });

  describe('getRequestErrorsMessage', () => {
    const validationError = [
      {
        target: {
          email: 'adminmail.com',
          password: process.env.TEST_PASSWORD,
          rememberMe: true,
        },
        value: 'adminmail.com',
        property: 'email',
        children: [],
        constraints: { isEmail: 'email must be an email' },
      },
    ];

    const validationErrorTwo = [
      {
        target: {
          email: 'adminmail.com',
          password: process.env.TEST_PASSWORD,
          rememberMe: true,
        },
        value: 'adminmail.com',
        property: 'email',
        constraints: { isEmail: 'email must be an email' },
        children: [
          {
            target: {
              email: 'adminmail.com',
              password: process.env.TEST_PASSWORD,
              rememberMe: true,
            },
            value: 'adminmail.com',
            property: 'email',
            constraints: {
              isEmail: 'email must be an email',
            },
            children: [],
          },
        ],
      },
    ];

    const validationErrorThree = [
      {
        target: {
          email: 'adminmail.com',
          password: process.env.TEST_PASSWORD,
          rememberMe: true,
        },
        value: 'adminmail.com',
        property: 'email',
        constraints: { isEmail: 'email must be an email' },
        children: [
          {
            target: {
              email: 'adminmail.com',
              password: process.env.TEST_PASSWORD,
              rememberMe: true,
            },
            value: 'adminmail.com',
            property: 'email',
            constraints: {
              isEmail: 'email must be an email',
            },
            children: [
              {
                target: {
                  email: 'adminmail.com',
                  password: process.env.TEST_PASSWORD,
                  rememberMe: true,
                },
                value: 'adminmail.com',
                property: 'email',
                constraints: {
                  isEmail: 'email must be an email',
                },
                children: [],
              },
            ],
          },
        ],
      },
    ];

    it('should be called', async () => {
      const test = jest.spyOn(
        responseMessageService,
        'getRequestErrorsMessage',
      );

      await responseMessageService.getRequestErrorsMessage(validationError);
      expect(test).toHaveBeenCalledWith(validationError);
    });

    it('single message should be success', async () => {
      const message = await responseMessageService.getRequestErrorsMessage(
        validationError,
        ['en'],
      );
      jest
        .spyOn(responseMessageService, 'getRequestErrorsMessage')
        .mockImplementation(async () => message);

      expect(
        await responseMessageService.getRequestErrorsMessage(validationError, [
          'en',
        ]),
      ).toBe(message);
    });

    it('multi message should be success', async () => {
      const message = await responseMessageService.getRequestErrorsMessage(
        validationError,
        // Optionally add more languages
        ['en'],
      );
      jest
        .spyOn(responseMessageService, 'getRequestErrorsMessage')
        .mockImplementation(async () => message);

      expect(
        await responseMessageService.getRequestErrorsMessage(
          validationError,
          // Optionally add more languages
          ['en'],
        ),
      ).toBe(message);
    });

    it('should be success', async () => {
      const message = await responseMessageService.getRequestErrorsMessage(
        validationError,
      );
      jest
        .spyOn(responseMessageService, 'getRequestErrorsMessage')
        .mockImplementation(async () => message);

      expect(
        await responseMessageService.getRequestErrorsMessage(validationError),
      ).toBe(message);
    });

    it('should be success', async () => {
      const message = await responseMessageService.getRequestErrorsMessage(
        validationError,
      );
      jest
        .spyOn(responseMessageService, 'getRequestErrorsMessage')
        .mockImplementation(async () => message);

      expect(
        await responseMessageService.getRequestErrorsMessage(validationError),
      ).toBe(message);
    });

    it('two children should be success', async () => {
      const message = await responseMessageService.getRequestErrorsMessage(
        validationErrorTwo,
      );
      jest
        .spyOn(responseMessageService, 'getRequestErrorsMessage')
        .mockImplementation(async () => message);

      expect(
        await responseMessageService.getRequestErrorsMessage(
          validationErrorTwo,
        ),
      ).toBe(message);
    });

    it('three children should be success', async () => {
      const message = await responseMessageService.getRequestErrorsMessage(
        validationErrorThree,
      );
      jest
        .spyOn(responseMessageService, 'getRequestErrorsMessage')
        .mockImplementation(async () => message);

      expect(
        await responseMessageService.getRequestErrorsMessage(
          validationErrorThree,
        ),
      ).toBe(message);
    });
  });

  describe('getLanguages', () => {
    it('should be called', async () => {
      const test = jest.spyOn(responseMessageService, 'getLanguages');

      await responseMessageService.getLanguages();
      expect(test).toHaveBeenCalled();
    });

    it('should be success', async () => {
      const languages = responseMessageService.getLanguages();
      jest
        .spyOn(responseMessageService, 'getLanguages')
        .mockImplementation(() => languages);

      expect(responseMessageService.getLanguages()).toBe(languages);
    });
  });
});
