import { Test, TestingModule } from '@nestjs/testing';
import { FormController } from './form.controller';
import { FormService } from './form.service';
import { Form } from './schemas/form.schema';
import { User } from 'src/user/schemas/user.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { CreateNewFormDto } from './dto/create-new-form.dto';
import { Question } from './schemas/question.schema';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('FormController', () => {
  let formService: FormService;
  let formModel: Model<Form>;
  let userModel: Model<User>;
  let questionModel: Model<Question>;
  let responseModel: Model<Response>;

  const user = { userId: 'userId123' } as any;
  const createNewFormDto: CreateNewFormDto = {
    formName: 'Test Form',
    formDescription: 'Description for Test Form',
  };
  const newForm = {
    _id: 'newFormId',
    ...createNewFormDto,
    createdBy: user.userId,
    questions: [],
    responses: [],
    slug: 'randomSlug',
    encryption: false,
    encryptionType: 'NONE',
    startingDate: new Date(),
    endingDate: new Date(),
  };
  const formID = 'someFormID';
  const userID = 'someUserID';
  const userInfo = { forms: [formID, 'otherFormID'], save: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormController],
      providers: [
        FormService,
        {
          provide: getModelToken('Form'),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
            findByIdAndDelete: jest.fn(),
          },
        },
        {
          provide: getModelToken('User'),
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: getModelToken('Question'),
          useValue: {
            create: jest.fn(),
            deleteMany: jest.fn(),
          },
        },
        {
          provide: getModelToken('Response'),
          useValue: {
            findOneAndDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    formService = module.get<FormService>(FormService);
    formModel = module.get<Model<Form>>(getModelToken('Form'));
    userModel = module.get<Model<User>>(getModelToken('User'));
    questionModel = module.get<Model<Question>>(getModelToken('Question'));
    responseModel = module.get<Model<Response>>(getModelToken('Response'));
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createNewForm', () => {
    it('should create a new form', async () => {
      jest.spyOn(formModel, 'create').mockResolvedValue(newForm as any);
      jest.spyOn(userModel, 'findById').mockResolvedValue(userInfo);

      const response = await formService.createNewForm(createNewFormDto, user);

      expect(formModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          formName: createNewFormDto.formName,
          formDescription: createNewFormDto.formDescription,
        }),
      );
      expect(userModel.findById).toHaveBeenCalledWith(user.userId);
      expect(userInfo.forms).toContain(newForm._id);
      expect(userInfo.save).toHaveBeenCalledTimes(1);
      expect(response).toEqual(newForm);
    });
  });

  describe('getAllUsersForm', () => {
    it('should get all users form', async () => {
      jest.spyOn(formModel, 'find').mockResolvedValue([newForm]);
      const args = user.userId;
      const response = await formService.getAllUserForms(args);
      expect(formModel.find).toHaveBeenCalledWith({ createdBy: args });
      expect(response).toEqual([newForm]);
    });
  });

  describe('getFormBySlug', () => {
    it('should get the form by the slug', async () => {
      const mockSelect = jest.fn().mockResolvedValue(newForm);
      const mockPopulate = jest.fn().mockReturnValue({ select: mockSelect });
      const mockFindOne = jest.fn().mockReturnValue({ populate: mockPopulate });
      jest.spyOn(formModel, 'findOne').mockImplementation(mockFindOne);
      const response = await formService.getFormBySlug('randomSlug', true);

      expect(response).toEqual(newForm);
      expect(mockFindOne).toHaveBeenCalledWith({ slug: 'randomSlug' });
      expect(mockPopulate).toHaveBeenCalledWith('questions');
      expect(mockSelect).toHaveBeenCalledWith('-responses');
    });
  });

  describe('getFormByFormID', () => {
    it('should get the form by ID', async () => {
      const mockSelect = jest.fn().mockResolvedValue(newForm);
      const mockPopulate = jest.fn().mockReturnValue({ select: mockSelect });
      const mockFindById = jest
        .fn()
        .mockReturnValue({ populate: mockPopulate });

      jest.spyOn(formModel, 'findById').mockImplementation(mockFindById);

      await formService.getFormByFormID(newForm._id);

      expect(mockFindById).toHaveBeenCalledWith(newForm._id);
      expect(mockPopulate).toHaveBeenCalledWith([
        { path: 'questions' },
        { path: 'responses' },
      ]);
    });
  });

  describe('updateForm', () => {
    it('should return an error if no form is found', async () => {
      jest.spyOn(formModel, 'findById').mockResolvedValue(null);
      const response = await formService.updateForm({
        ...newForm,
        formId: 'id',
        formType: 'data',
      } as any);
      expect(formModel.findById).toHaveBeenCalledWith('id');
      expect(response).toEqual('This form does not exist');
    });
    it('should return the updated form', async () => {
      const questions = [
        {
          _id: 'q3',
          questionText: 'What is the chemical symbol for water?',
          questionType: 'PICK_ONE',
          options: ['H2O', 'O2', 'CO2'],
          correctAnswer: 0,
          explanation: 'The chemical symbol for water is H2O.',
          timeLimit: 15,
          formId: '671819c12ce85c28b53337d7',
        },
      ];
      const form = {
        ...newForm,
        questions,
        save: jest.fn(),
      };

      jest.spyOn(formModel, 'findById').mockResolvedValue(form);
      jest
        .spyOn(questionModel, 'create')
        .mockResolvedValue(form.questions as any);

      const response = await formService.updateForm({
        ...form,
        formId: 'id',
        formType: 'data',
      } as any);
      expect(formModel.findById).toHaveBeenCalledWith('id');
      expect(form.save).toHaveBeenCalledTimes(1);
      expect(questionModel.create).toHaveBeenCalledWith(form.questions);
      expect(form.questions).toContain('q3');
    });
  });

  describe('deleteForm', () => {
    it('should delete the form and update user details', async () => {
      jest.spyOn(questionModel, 'deleteMany').mockResolvedValue({} as any);
      jest.spyOn(formModel, 'findByIdAndDelete').mockResolvedValue({});
      jest.spyOn(responseModel, 'findOneAndDelete').mockResolvedValue({});
      jest.spyOn(userModel, 'findById').mockResolvedValue(userInfo);

      const result = await formService.deleteForm(formID, userID);

      expect(questionModel.deleteMany).toHaveBeenCalledWith({ formID });
      expect(formModel.findByIdAndDelete).toHaveBeenCalledWith(formID);
      expect(responseModel.findOneAndDelete).toHaveBeenCalledWith({
        formId: formID,
      });
      expect(userModel.findById).toHaveBeenCalledWith(userID);
      expect(userInfo.save).toHaveBeenCalled();
      expect(result).toBe('Form Deleted');
    });
    it('should throw an error if any operation fails', async () => {
      jest
        .spyOn(questionModel, 'deleteMany')
        .mockRejectedValue(new Error('Delete failed'));

      await expect(formService.deleteForm(formID, userID)).rejects.toThrow(
        new HttpException(
          'unable to delete the form',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
});
