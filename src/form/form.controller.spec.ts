import { Test, TestingModule } from '@nestjs/testing';
import { FormController } from './form.controller';
import { FormService } from './form.service';

const mockFormService = {
  createNewForm: jest.fn(),
  getAllUserForms: jest.fn(),
  getFormBySlug: jest.fn(),
  updateForm: jest.fn(),
  getFormByFormId: jest.fn(),
};

describe('FormController', () => {
  let formController: FormController;
  let formService: FormService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormController],
      providers: [
        {
          provide: FormService,
          useValue: mockFormService,
        },
      ],
    }).compile();
    formController = module.get<FormController>(FormController);
    formService = module.get<FormService>(FormService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserForms', () => {
    it('should get all the forms of a user', async () => {
      const req = { user: { userId: 123 } };

      const formResponse = {
        formName: 'Geography Challenge',
        formDescription: 'Challenge your geography knowledge.',
        formType: 'Quiz',
        startingDate: '2023-10-15T00:00:00Z',
        endingDate: '2024-01-15T00:00:00Z',
        encryption: true,
        encryptionType: 'RSA',
        questions: [
          {
            questionText: 'What is the capital of Japan?',
            questionType: 'SINGLE_CHOICE',
            options: ['Beijing', 'Seoul', 'Tokyo'],
            correctAnswer: 2,
            explanation: 'Tokyo is the capital of Japan.',
            timeLimit: 25,
          },
        ],
      };
      const userId = req.user.userId;
      mockFormService.getAllUserForms.mockResolvedValue([formResponse]);
      const response = await formController.getAllUserForms(userId);

      expect(formService.getAllUserForms).toHaveBeenCalledWith(userId);
      expect(response).toEqual([formResponse]);
    });
  });
});
