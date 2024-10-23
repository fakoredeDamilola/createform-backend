import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateNewFormDto } from './dto/create-new-form.dto';
import { Form } from './schemas/form.schema';
import { EncryptionType } from './constants';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import IAuthUser from 'src/auth/interface/IAuthUser';
import { UpdateFormDto } from './dto/update-form-dto';
import { Question } from './schemas/question.schema';
import { getRandomString } from '../utils/functions';
import { User } from '../user/schemas/user.schema';
import { Response } from '../response/schemas/response.schema';

@Injectable()
export class FormService {
  constructor(
    @InjectModel(Form.name) private formModel: Model<Form>,
    @InjectModel(Question.name) private questionModel: Model<Question>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Response.name) private responseModel: Model<Response>,
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

      const userInfo = await this.userModel.findById(user.userId);
      userInfo.forms.push(savedForm._id as any);
      userInfo.save();
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
      .populate([{ path: 'questions' }, { path: 'responses' }]);
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
        formToEdit.formName = updateFormDto.formName;
        formToEdit.formDescription = updateFormDto.formDescription;
        formToEdit.formType = updateFormDto.formType ?? '';
        formToEdit.encryption = updateFormDto.encryption;
        formToEdit.encryptionType = updateFormDto.encryptionType;
        if (updateFormDto?.questions?.length > 0) {
          const createQuestions = await this.questionModel.create(
            updateFormDto.questions,
          );
          formToEdit.questions.push(
            ...createQuestions.map((question) => question._id),
          );
        }

        const savedForm = await formToEdit.save();
        return savedForm;
      }
    } catch (e) {
      console.log({ e });
      throw new HttpException(
        'An error occurred while updating the form',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteForm(formID: string, userId: string) {
    try {
      await this.questionModel.deleteMany({ formID });
      await this.formModel.findByIdAndDelete(formID);
      await this.responseModel.findOneAndDelete({ formId: formID });
      const userDetails = await this.userModel.findById(userId);
      if (userDetails) {
        userDetails.forms = userDetails.forms.filter(
          (form) => form.toString() !== formID,
        );
        await userDetails.save();
      }
      return 'Form Deleted';
    } catch (e) {
      throw new HttpException(
        'unable to delete the form',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
