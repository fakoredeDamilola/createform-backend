import { Test, TestingModule } from '@nestjs/testing';
import { FormController } from './form.controller';
import { FormService } from './form.service';
import { EncryptionType } from './constants';
import { QuestionDto } from './dto/question.dto';
import { QuestionType } from './schemas/question.schema';

const mockFormService = {
  createNewForm: jest.fn(),
  getAllUserForms: jest.fn(),
  getFormBySlug: jest.fn(),
  updateForm: jest.fn(),
  getFormByFormID: jest.fn(),
};

describe('FormController', () => {
  let formController: FormController;
  let formService: FormService;

  const formResponse = {
    formName: 'Geography Challenge',
    formDescription: 'Challenge your geography knowledge.',
    formType: 'Quiz',
    startingDate: '2023-10-15T00:00:00Z',
    endingDate: '2024-01-15T00:00:00Z',
    encryption: true,
    encryptionType: EncryptionType.EMAIL,
    questions: [
      {
        questionText: 'What is the capital of Japan?',
        questionType: QuestionType.PICK_ONE,
        options: ['Beijing', 'Seoul', 'Tokyo'],
        correctAnswer: 2,
        explanation: 'Tokyo is the capital of Japan.',
        timeLimit: 25,
      },
    ] as QuestionDto[],
  };
  const req = { user: { userId: 123 } };

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
      const userId = req.user.userId;
      mockFormService.getAllUserForms.mockResolvedValue([formResponse]);
      const response = await formController.getAllUserForms(req);

      expect(formService.getAllUserForms).toHaveBeenCalledWith(userId);
      expect(response).toEqual([formResponse]);
    });
  });
  describe('getFormById', () => {
    it('should get the form by the ID', async () => {
      const formID = '13';
      mockFormService.getFormByFormID.mockResolvedValue(formResponse);
      const response = await formController.getFormByFormID(formID);

      expect(formService.getFormByFormID).toHaveBeenCalledWith(formID);
      expect(response).toEqual(formResponse);
    });
  });
  describe('getFormBySlug', () => {
    it('should get the form by the Slug', async () => {
      const formSlug = 'abc';
      mockFormService.getFormBySlug.mockResolvedValue(formResponse);
      const response = await formController.getFormBySlug(formSlug);

      expect(formService.getFormBySlug).toHaveBeenCalledWith(formSlug);
      expect(response).toEqual(formResponse);
    });
  });
  describe('createNewForm', () => {
    it('should create a new form', async () => {
      const newForm = {
        formName: 'Geography Challenge',
        formDescription: 'Challenge your geography knowledge.',
      };
      mockFormService.createNewForm.mockResolvedValue(newForm);
      const response = await formController.createNewForm(newForm, req);

      expect(formService.createNewForm).toHaveBeenCalledWith(newForm, req.user);
      expect(response).toEqual(newForm);
    });
  });
  describe('updateForm', () => {
    it('should update the form', async () => {
      const updateForm = {
        ...formResponse,
      };
      mockFormService.updateForm.mockResolvedValue(updateForm);
      const response = await formController.updateForm({
        ...updateForm,
        formId: '12',
      });

      expect(response).toEqual(updateForm);
    });
  });
});
