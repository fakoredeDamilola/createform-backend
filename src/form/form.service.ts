import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateNewFormDto } from './dto/create-new-form.dto';
import { Form } from './schemas/form.schema';
import { EncryptionType, FormItemType, FormStaticType } from './constants';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import IAuthUser from 'src/auth/interface/IAuthUser';
import { UpdateFormDto } from './dto/update-form-dto';
import { Question } from './schemas/question.schema';
import { getRandomString } from '../utils/functions';
import { User } from '../user/schemas/user.schema';
import { Response } from '../response/schemas/response.schema';
import { UpdateFormInsightDto } from './dto/update-form-insight.dto';
import { QuestionDto } from './dto/question.dto';
import { CreateAnswerDto } from './dto/create-answer.dto';

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
      if (!user || !user.userId) {
        throw new Error('User ID is required to create a form.');
      }

      const newForm: Form = {
        formName: createNewFormDto.formName,
        formDescription: createNewFormDto.formDescription,
        formType: '',
        totalFormTimeLimit: '0',
        publish: false,
        noOfQuestions: 0,
        formSettings: {
          createFormBranding: true,
          navigationArrow: true,
          progressBar: true,
          questionNumber: true,
          addAnswerToQuestion: false,
          addTimeLimitToForm: false,
          popQuiz: false,
          encryption: false,
        },
        formResponseInsights: {
          views: 0,
          starts: 0,
          submitted: 0,
        },
        createdBy: user.userId as any,
        startingDate: new Date(),
        endingDate: new Date(),
        encryptionDetails: [],
        questions: [],
        responses: [],
        slug: getRandomString(),
        formStartPage: {
          pageTitle: '',
          pageDescription: '',
          instructions: [],
          questionId: createNewFormDto.formStartPageId,
          formItemType: FormItemType.STATIC,
          formStaticType: FormStaticType.START,
        },
        formEndPage: {
          pageTitle: '',
          pageDescription: '',
          instructions: [],
          questionId: createNewFormDto.formEndPageId,
          formItemType: FormItemType.STATIC,
          formStaticType: FormStaticType.END,
        },
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
    return await this.userModel.findById(userId).populate('forms');
  }

  async getFormBySlug(slug: string, removeResponse: boolean, answer: string) {
    console.log({ answer });
    let query = this.formModel.findOne({ slug }).populate({
      path: 'questions',
      populate: {
        path: 'correctAnswer',
      },
    });

    if (answer === 'no') {
      query = this.formModel.findOne({ slug }).populate({
        path: 'questions',
        select: '-correctAnswer',
      });
    }
    if (removeResponse) {
      query = query.select('-responses');
    }
    const form = await query;
    if (form) {
      return form;
    } else {
      throw new HttpException('Form not found', HttpStatus.NOT_FOUND);
    }
  }

  async getFormByFormID(formID: string) {
    const form = await this.formModel.findById(formID).populate([
      {
        path: 'questions',
        populate: {
          path: 'correctAnswer',
        },
      },
      { path: 'responses' },
    ]);
    if (form) {
      return form;
    } else {
      return null;
    }
  }

  async getQuestionByIdWithAnswer(questionId: string) {
    const question = await this.questionModel.findById(questionId);
    if (question) {
      return question;
    } else {
      return null;
    }
  }

  async getQuestionByQuestionID(questionID: string) {
    const question = await this.questionModel.findById(questionID);
    if (question) {
      return question;
    } else {
      return null;
    }
  }

  async updateForm(updateFormDto: UpdateFormDto) {
    try {
      console.log({ updateFormDto });
      const formToEdit = await this.formModel.findById(updateFormDto._id);

      if (!formToEdit) {
        return `This form does not exist`;
      } else {
        formToEdit.formName = updateFormDto.formName;
        formToEdit.formDescription = updateFormDto.formDescription;
        formToEdit.publish = updateFormDto.publish;
        formToEdit.formType = updateFormDto.formType ?? '';
        formToEdit.noOfQuestions = updateFormDto.noOfQuestions ?? 1;
        formToEdit.totalFormTimeLimit = updateFormDto.totalFormTimeLimit ?? '0';
        formToEdit.formSettings = updateFormDto.formSettings;
        formToEdit.encryptionDetails = updateFormDto.encryptionDetails;
        formToEdit.formStartPage = updateFormDto.formStartPage;
        formToEdit.formEndPage = updateFormDto.formEndPage;
        if (updateFormDto?.questions?.length > 0) {
          const { results } = await this.updateOrCreateQuestions(
            updateFormDto.questions,
          );

          formToEdit.questions = results.map((item) => item.question._id);
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

  async createNewQuestion(questionDto: QuestionDto, user: IAuthUser) {
    try {
      if (!user || !user.userId) {
        throw new Error('User ID is required to create a form.');
      }

      const formToEdit = await this.formModel.findById(questionDto.formId);

      if (!formToEdit) {
        return `This form does not exist`;
      } else {
        const { results, questionCreated } = await this.updateOrCreateQuestions(
          [questionDto],
        );
        formToEdit.questions = [
          ...formToEdit.questions,
          ...results.map((item) => item.question._id),
        ];
        await formToEdit.save();
        console.log({ questionCreated });
        return questionCreated;
      }
    } catch (e) {
      console.log({ e });
      throw new HttpException(
        'An error occurred while updating the form',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateFormInsight(
    formID: string,
    updateFormInsightDto: UpdateFormInsightDto,
  ) {
    try {
      const updateQuery = {};
      for (const [key, value] of Object.entries(updateFormInsightDto || {})) {
        if (value !== undefined) {
          updateQuery[`formResponseInsights.${key}`] = value;
        }
      }
      if (Object.keys(updateQuery).length > 0) {
        const updatedDoc = await this.formModel.findByIdAndUpdate(
          formID,
          { $inc: updateQuery },
          { new: true },
        );
        return updatedDoc;
      } else {
        console.log('No valid properties found in DTO.');
        return null;
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

  async deleteQuestion(questionId: string, formId: string) {
    try {
      const deletedQuestion =
        await this.questionModel.findByIdAndDelete(questionId);

      if (!deletedQuestion) {
        throw new Error('Question not found');
      }
      const form = await this.formModel.findById(formId);

      if (form) {
        form.questions = form.questions.filter(
          (question) => question._id.toString() !== questionId,
        );
        await form.save();
      }
      const objectIdFormId = new mongoose.Types.ObjectId(formId);

      const remainingQuestions = await this.questionModel.find({
        formId: objectIdFormId,
      });

      const updatedQuestions = remainingQuestions.map((question, index) => ({
        ...question.toObject(),
        questionNumber: index + 1,
      }));
      const bulkOps = updatedQuestions.map((question) => ({
        updateOne: {
          filter: { _id: question._id },
          update: { $set: { questionNumber: question.questionNumber } },
        },
      }));

      await this.questionModel.bulkWrite(bulkOps);

      return 'Question deleted and numbers updated';
    } catch (error) {
      console.error('Error during question deletion and renumbering:', error);
      throw error;
    }
  }

  async updateOrCreateQuestions(questions: QuestionDto[]) {
    const results = [];
    let questionCreated;
    for (const question of questions) {
      let result;
      const existingQuestion = await this.questionModel.findOne({
        questionId: question.questionId,
      });

      if (existingQuestion) {
        const { correctAnswer, ...filterQuestion } = question;
        await this.questionModel.updateOne(
          { questionId: question.questionId },
          { $set: filterQuestion },
        );

        result = await this.questionModel.findOne({
          questionId: question.questionId,
        });
      } else {
        result = await this.questionModel.create(question);
      }

      const optionResults = [];
      if (question.options?.length) {
        for (const option of question.options || []) {
          const query = {
            questionId: question.questionId,
            'options.optionId': option.optionId,
          };
          const update = {
            $set: {
              'options.$': option,
            },
          };
          const updateResult = await this.questionModel.updateOne(
            query,
            update,
          );

          if (updateResult.modifiedCount === 0) {
            await this.questionModel.updateOne(
              { questionId: question.questionId },
              { $push: { options: option } },
            );
          }

          const updatedQuestion = await this.questionModel.findOne({
            questionId: question.questionId,
          });
          const updatedOption = updatedQuestion.options.find(
            (opt) => opt.optionId === option.optionId,
          );
          optionResults.push(updatedOption);
        }
      }
      if (question.correctAnswer?.questionId) {
        this.createNewAnswerForQuestion(question.correctAnswer);
      }
      questionCreated = result;
      results.push({
        question: result,
        options: optionResults,
      });
    }

    return { results, questionCreated };
  }

  async createNewAnswerForQuestion(createAnswerDto: CreateAnswerDto) {
    const question = await this.getQuestionByQuestionID(
      createAnswerDto.questionId,
    );
    if (!question) {
      throw new UnauthorizedException('Question does not exist');
    } else {
      const newAnswer = {
        questionAnswerId: createAnswerDto.questionAnswerId,
        description: createAnswerDto.description ?? '',
        answerResults: createAnswerDto.answerResults as any,
        formId: createAnswerDto.formId as any,
        questionId: createAnswerDto.questionId as any,
        questionType: createAnswerDto.questionType,
      };

      question.correctAnswer = newAnswer;

      await question.save();

      return 'question saved';
    }
  }
}
