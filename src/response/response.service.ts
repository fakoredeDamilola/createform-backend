import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from './schemas/response.schema';
import { get, Model, Types } from 'mongoose';
import { FormService } from '../form/form.service';
import { UpdateResponseDto } from './dto/update-response.dto';
import { IAnswer } from './interfaces/IAnswer';
import { ResponseType } from 'src/form/constants';
import { UpdateAnswerInResponseDto } from './dto/update-answer-in-response.dto';
import { QuestionType } from 'src/form/schemas/question.schema';

@Injectable()
export class ResponseService {
  constructor(
    @InjectModel(Response.name) private responseModel: Model<Response>,
    private formService: FormService,
  ) {}

  async updateOrCreateNewResponse(updateResponseDto: UpdateResponseDto) {
    const form = await this.formService.getFormByFormID(
      updateResponseDto.formId,
    );
    if (!form) {
      throw new UnauthorizedException('Form does not exist');
    } else {
      const responseId = updateResponseDto.responseId;
      let response;
      if (responseId) {
        response = await this.getResponseByResponseId(responseId);

        response.encryptionDetails = updateResponseDto.encryptionDetails;

        response.save();
      } else {
        const newResponse: Response = {
          responseSubmitted: false,
          totalTimeTaken: updateResponseDto.totalTimeTaken,
          answers: updateResponseDto.answers as any,
          formId: updateResponseDto.formId as any,
          submissionDate: updateResponseDto.submissionDate as any,
          encryptionType: updateResponseDto.encryptionType,
          formSlug: updateResponseDto.formSlug,
          encryptionDetails: updateResponseDto.encryptionDetails,
          noOfQuestionsAnswered: updateResponseDto.noOfQuestionsAnswered ?? 0,
        };
        response = await this.responseModel.create(newResponse);

        form.responses.push(response._id);

        await form.save();
      }

      return { response };
    }
  }

  async updateAnswerInResponse(
    updateAnswerInResponseDto: UpdateAnswerInResponseDto,
  ) {
    const answerId = updateAnswerInResponseDto.answer.answerId;
    const query = {
      _id: updateAnswerInResponseDto.responseId,
      'answers.answerId': answerId,
    };
    const update = {
      $set: {
        'answers.$': updateAnswerInResponseDto.answer,
      },
    };
    await this.responseModel.updateOne(query, update);
    let correctAnswer, totalResponse;
    const form = await this.formService.getFormByFormID(
      updateAnswerInResponseDto.formId,
    );
    if (updateAnswerInResponseDto.popQuiz) {
      await this.findQuestionAndMark(
        updateAnswerInResponseDto.answer,
        updateAnswerInResponseDto.responseId,
      );
      const question: any = form.questions.find(
        (question) =>
          question._id.toString() ===
          updateAnswerInResponseDto.answer.questionId,
      );
      correctAnswer = question.correctAnswer;
      console.log({ correctAnswer: correctAnswer.answerResults });
    }
    if (updateAnswerInResponseDto.responseSubmitted) {
      await this.responseModel.findOneAndUpdate(
        { responseId: updateAnswerInResponseDto.responseId },
        { responseSubmitted: true },
      );

      totalResponse = await this.getResponseByResponseId(
        updateAnswerInResponseDto.responseId,
      );
    }
    return { correctAnswer, totalResponse };
  }

  async markResponseWithAnswers(userResponse: any) {
    const answers = userResponse.answers;

    for (const answer of answers || []) {
      this.findQuestionAndMark(answer.toObject(), userResponse._id);
    }

    return 'response Saved';
  }

  async getResponseByResponseId(responseId: string) {
    const response = await this.responseModel.findById(responseId);
    if (response) {
      return response;
    } else {
      return null;
    }
  }

  async findQuestionAndMark(answer: any, userResponseId: string) {
    const findQuestion = await this.formService.getQuestionByIdWithAnswer(
      answer.questionId,
    );
    if (!findQuestion) {
      return; // Skip if the question isn't found
    } else {
      let isAnswerCorrect = false;
      const questionType = findQuestion.questionType;
      switch (questionType) {
        case QuestionType.multiple_choice:
          isAnswerCorrect = (
            findQuestion.correctAnswer as any
          ).answerResults.includes(answer.optionId);

          break;
        case QuestionType.long_text || QuestionType.short_text:
          isAnswerCorrect =
            findQuestion?.correctAnswer.answerResults[0].toLowerCase() ===
            answer.textResponse.toLowerCase()
              ? true
              : false;
          break;
        default:
          break;
      }

      const newFields = {
        ...answer, // Preserve existing fields of the answer
        correctResponse: isAnswerCorrect,
        scoreForQuestion: isAnswerCorrect ? 1 : 0,
      };
      const query = {
        _id: userResponseId,
        'answers.answerId': answer.answerId,
      };
      const update = {
        $set: {
          'answers.$': newFields,
        },
      };
      const updateAnswer = await this.responseModel.updateOne(query, update);
    }
  }
}
