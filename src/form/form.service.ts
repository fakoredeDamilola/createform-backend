import { Injectable } from '@nestjs/common';
import { CreateNewFormDto } from './dto/create-new-form.dto';
import { Form } from './schemas/form.schema';
import { EncryptionType } from './constants';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import IAuthUser from 'src/auth/interface/IAuthUser';
import { UpdateFormDto } from './dto/update-form-dto';
import { Question } from './schemas/question.schema';
import { getRandomString } from '../utils/functions';

@Injectable()
export class FormService {
  constructor(
    @InjectModel(Form.name) private formModel: Model<Form>,
    @InjectModel(Question.name) private questionModel: Model<Question>,
  ) {}

  async createNewForm(createNewFormDto: CreateNewFormDto, user: IAuthUser) {
    try {
      const newForm: Form = {
        formName: createNewFormDto.formName,
        formDescription: createNewFormDto.formDescription,
        formType: '',
        createdBy: user.userId as any,
        startingDate: new Date(),
        endingDate: new Date(),
        encryption: false,
        encryptionType: EncryptionType.NONE,
        questions: [],
        responses: [],
        slug: getRandomString(),
      };
      const savedForm = await this.formModel.create(newForm);
      return savedForm;
    } catch (e) {
      console.log({ e });
    }
  }

  async getAllUserForms(userId: string) {
    return await this.formModel.find({ createdBy: userId });
  }

  async getFormBySlug(slug: string, removeResponse: boolean = true) {
    let query = this.formModel.findOne({ slug }).populate('questions');
    if (removeResponse) {
      query = query.select('-responses');
    }
    const form = await query;
    if (form) {
      return form;
    } else {
      return null;
    }
  }

  async getFormByFormID(formID: string) {
    const form = await this.formModel
      .findById(formID)
      .populate('questions')
      .populate('responses');
    if (form) {
      return form;
    } else {
      return null;
    }
  }

  async updateForm(updateFormDto: UpdateFormDto) {
    try {
      const formToEdit = await this.formModel.findById(updateFormDto.formId);
      if (!formToEdit) {
        return `This form does not exist`;
      } else {
        const createQuestions = await this.questionModel.create(
          updateFormDto.questions,
        );
        formToEdit.formName = updateFormDto.formName;
        formToEdit.formDescription = updateFormDto.formDescription;
        formToEdit.formType = updateFormDto.formType ?? '';
        formToEdit.encryption = updateFormDto.encryption;
        formToEdit.encryptionType = updateFormDto.encryptionType;
        formToEdit.questions.push(
          ...createQuestions.map((question) => question._id),
        );

        const savedForm = await formToEdit.save();
        return savedForm;
      }
    } catch (e) {
      console.log({ e });
    }
  }
}
