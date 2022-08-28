import { Test } from '@nestjs/testing';

import { ValidationError } from 'class-validator';

import { CommonModule } from '@/core/core.module';

import { ResponseMessageService } from '@/response-message/service';

import { IValidationErrorImport } from '@/utils/error/type';

describe('ResponseMessageService', () => {
  let responseMessageService: ResponseMessageService;

  let validationError: ValidationError[];
  let validationErrorTwo: ValidationError[];
  let validationErrorThree: ValidationError[];
  let validationErrorConstrainEmpty: ValidationError[];
  let validationErrorImport: IValidationErrorImport[];

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CommonModule],
    }).compile();

    responseMessageService = moduleRef.get<ResponseMessageService>(
      ResponseMessageService,
    );

    validationError = [
      {
        target: {
          email: 'admin-mail.com',
          password: process.env.TEST_PASSWORD,
          rememberMe: true,
        },
        value: 'admin-mail.com',
        property: 'email',
        children: [],
        constraints: { isEmail: 'email must be an email' },
      },
    ];

    validationErrorTwo = [
      {
        target: {
          email: 'admin-mail.com',
          password: process.env.TEST_PASSWORD,
          rememberMe: true,
        },
        value: 'admin-mail.com',
        property: 'email',
        constraints: { isEmail: 'email must be an email' },
        children: [
          {
            target: {
              email: 'admin-mail.com',
              password: process.env.TEST_PASSWORD,
              rememberMe: true,
            },
            value: 'admin-mail.com',
            property: 'email',
            constraints: {
              isEmail: 'email must be an email',
            },
            children: [],
          },
        ],
      },
    ];

    validationErrorThree = [
      {
        target: {
          email: 'admin-mail.com',
          password: process.env.TEST_PASSWORD,
          rememberMe: true,
        },
        value: 'admin-mail.com',
        property: 'email',
        constraints: { isEmail: 'email must be an email' },
        children: [
          {
            target: {
              email: 'admin-mail.com',
              password: process.env.TEST_PASSWORD,
              rememberMe: true,
            },
            value: 'admin-mail.com',
            property: 'email',
            constraints: {
              isEmail: 'email must be an email',
            },
            children: [
              {
                target: {
                  email: 'admin-mail.com',
                  password: process.env.TEST_PASSWORD,
                  rememberMe: true,
                },
                value: 'admin-mail.com',
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

    validationErrorConstrainEmpty = [
      {
        target: {
          email: 'admin-mail.com',
          password: process.env.TEST_PASSWORD,
          rememberMe: true,
        },
        value: 'admin-mail.com',
        property: 'email',
        children: [],
      },
    ];

    validationErrorImport = [
      {
        row: 0,
        file: 'error.xlsx',
        errors: [
          {
            target: {
              number: 1,
              area: 'area',
              city: 'area city',
              gps: { latitude: 6.1754, longitude: 106.8272 },
              address: 'address 1',
              tags: ['test', 'lala'],
            },
            property: 'mainBranch',
            children: [],
            constraints: {
              isNotEmpty: 'mainBranch should not be empty',
              isString: 'mainBranch must be a string',
            },
          },
        ],
      },
      {
        row: 1,
        file: 'error.xlsx',
        errors: [
          {
            target: {
              number: 2,
              area: 'area',
              city: 'area city',
              tags: [],
            },
            property: 'mainBranch',
            children: [],
            constraints: {
              isNotEmpty: 'mainBranch should not be empty',
              isString: 'mainBranch must be a string',
            },
          },
        ],
      },
      {
        row: 2,
        file: 'error.xlsx',
        errors: [
          {
            target: {
              number: null,
              area: 'area',
              city: 'area city',
              address: 'address 3',
              tags: ['test'],
            },
            value: null,
            property: 'number',
            children: [],
            constraints: {
              min: 'number must not be less than 0',
              isNumber:
                'number must be a number conforming to the specified constraints',
            },
          },
          {
            target: {
              number: null,
              area: 'area',
              city: 'area city',
              address: 'address 3',
              tags: ['test'],
            },
            property: 'mainBranch',
            children: [],
            constraints: {
              isNotEmpty: 'mainBranch should not be empty',
              isString: 'mainBranch must be a string',
            },
          },
        ],
      },
      {
        row: 3,
        file: 'error.xlsx',
        errors: [
          {
            target: {
              number: 4,
              area: 'area',
              city: 'area city',
              gps: { latitude: 6.1754, longitude: 106.8273 },
              address: 'address 4',
              tags: ['hand', 'test'],
            },
            property: 'mainBranch',
            children: [],
            constraints: {
              isNotEmpty: 'mainBranch should not be empty',
              isString: 'mainBranch must be a string',
            },
          },
        ],
      },
      {
        row: 4,
        file: 'error.xlsx',
        errors: [
          {
            target: {
              number: null,
              area: 'area',
              city: 'area city',
              tags: ['lala'],
            },
            value: null,
            property: 'number',
            children: [],
            constraints: {
              min: 'number must not be less than 0',
              isNumber:
                'number must be a number conforming to the specified constraints',
            },
          },
          {
            target: {
              number: null,
              area: 'area',
              city: 'area city',
              tags: ['lala'],
            },
            property: 'mainBranch',
            children: [],
            constraints: {
              isNotEmpty: 'mainBranch should not be empty',
              isString: 'mainBranch must be a string',
            },
          },
        ],
      },
      {
        row: 5,
        file: 'error.xlsx',
        errors: [
          {
            target: {
              number: 6,
              area: 'area',
              city: 'area city',
              gps: { latitude: 6.1754, longitude: 106.8273 },
              address: 'address 6',
              tags: [],
            },
            property: 'mainBranch',
            children: [],
            constraints: {
              isNotEmpty: 'mainBranch should not be empty',
              isString: 'mainBranch must be a string',
            },
          },
        ],
      },
    ];
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

    it('multi message if there has some undefined value should be success', async () => {
      const message = await responseMessageService.getRequestErrorsMessage(
        validationError,
        [undefined, 'en'],
      );
      jest
        .spyOn(responseMessageService, 'getRequestErrorsMessage')
        .mockImplementation(async () => message);

      expect(
        await responseMessageService.getRequestErrorsMessage(validationError, [
          undefined,
          'en',
        ]),
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

    it('empty constrain should be success', async () => {
      const message = await responseMessageService.getRequestErrorsMessage(
        validationErrorConstrainEmpty,
      );
      jest
        .spyOn(responseMessageService, 'getRequestErrorsMessage')
        .mockImplementation(async () => message);

      expect(
        await responseMessageService.getRequestErrorsMessage(
          validationErrorConstrainEmpty,
        ),
      ).toBe(message);
    });
  });

  describe('getImportErrorsMessage', () => {
    it('should be called', async () => {
      const test = jest.spyOn(responseMessageService, 'getImportErrorsMessage');

      await responseMessageService.getImportErrorsMessage(
        validationErrorImport,
      );
      expect(test).toHaveBeenCalled();
    });

    it('should be success', async () => {
      const languages = responseMessageService.getImportErrorsMessage(
        validationErrorImport,
      );
      jest
        .spyOn(responseMessageService, 'getImportErrorsMessage')
        .mockImplementation(() => languages);

      expect(
        responseMessageService.getImportErrorsMessage(validationErrorImport),
      ).toBe(languages);
    });

    it('should be success with options', async () => {
      const languages = responseMessageService.getImportErrorsMessage(
        validationErrorImport,
        ['en'],
      );
      jest
        .spyOn(responseMessageService, 'getImportErrorsMessage')
        .mockImplementation(() => languages);

      expect(
        responseMessageService.getImportErrorsMessage(validationErrorImport, [
          'en',
        ]),
      ).toBe(languages);
    });
  });
});
