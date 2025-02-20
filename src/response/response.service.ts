import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from './schemas/response.schema';
import { Model, Types } from 'mongoose';
import { FormService } from '../form/form.service';
import { UpdateResponseDto } from './dto/update-response.dto';
import { UpdateAnswerInResponseDto } from './dto/update-answer-in-response.dto';
import { QuestionType } from 'src/form/schemas/question.schema';
import { UpdateEncryptionDto } from './dto/update-encryption.dto';

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
    console.log({ updateAnswerInResponseDto });
    const answerId = updateAnswerInResponseDto.answer.answerId;
    const answerExists = await this.responseModel.findOne({
      _id: updateAnswerInResponseDto.responseId,
      'answers.answerId': answerId,
    });
    const query = {
      _id: updateAnswerInResponseDto.responseId,
      'answers.answerId': answerId,
    };
    const update = {
      $set: {
        'answers.$.timeLeft': updateAnswerInResponseDto.answer.timeLeft ?? 0,
        'answers.$.scoreForQuestion':
          updateAnswerInResponseDto.answer.scoreForQuestion,
        'answers.$.optionId': updateAnswerInResponseDto.answer.optionId,
        'answers.$.selectedOptions':
          updateAnswerInResponseDto.answer.selectedOptions,
        'answers.$.textResponse': updateAnswerInResponseDto.answer.textResponse,
        'answers.$.disabledResponse':
          updateAnswerInResponseDto.answer.disabledResponse,
        'answers.$.answeredQuestion':
          updateAnswerInResponseDto.answer.answeredQuestion,
        'answers.$.correctResponse':
          updateAnswerInResponseDto.answer.correctResponse,
      },
    };
    const updated = await this.responseModel.updateOne(query, update);

    console.log({ updated, answerExists });
    let correctAnswer, totalResponse;

    const { popQuiz, responseSubmitted } = updateAnswerInResponseDto;
    if (popQuiz || responseSubmitted) {
      const form = await this.formService.getFormByFormID(
        updateAnswerInResponseDto.formId,
      );

      if (popQuiz) {
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
      if (responseSubmitted) {
        await this.responseModel.findOneAndUpdate(
          { responseId: updateAnswerInResponseDto.responseId },
          { responseSubmitted: true },
        );

        if (form.formSettings.markResponseAfterSubmission) {
          this.markResponseWithAnswers(updateAnswerInResponseDto.responseId);
        }

        totalResponse = await this.getResponseByResponseId(
          updateAnswerInResponseDto.responseId,
        );
      }
    }

    return { correctAnswer, totalResponse };
  }

  async updateEncryptionDetailsInResponse(
    updateEncryptionDto: UpdateEncryptionDto,
  ) {
    console.log({ updateEncryptionDto });
    const { responseId } = updateEncryptionDto;

    const result = await this.responseModel.findByIdAndUpdate(responseId, {
      encryptionDetails: updateEncryptionDto.encryptionDetails,
    });
    return result;
  }

  async markResponseWithAnswers(responseId: string) {
    const userResponse = await this.getResponseByResponseId(responseId);
    if (userResponse) {
      const answers = userResponse.answers;

      for (const answer of answers || []) {
        this.findQuestionAndMark(answer, userResponse._id.toString());
      }
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
    console.log({ answer, correctAnswer: findQuestion.correctAnswer });
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
            findQuestion?.correctAnswer.answerResults[0].toLowerCase() ==
            answer.textResponse.toLowerCase()
              ? true
              : false;
          break;
        case QuestionType.fill_the_gap:
          console.log('fill the gap');
          findQuestion.correctAnswer.answerResults.forEach((ans, index) =>
            ans == answer.selectedOptions[index] ? true : false,
          );
        default:
          break;
      }
      console.log({ isAnswerCorrect });

      const query = {
        _id: userResponseId,
        'answers.answerId': answer.answerId,
      };
      const update = {
        $set: {
          'answers.$.correctResponse': isAnswerCorrect,
          'answers.$.scoreForQuestion': isAnswerCorrect ? 1 : 0,
          'answers.$.answeredQuestion': true,
        },
      };
      await this.responseModel.updateOne(query, update);
    }
  }
}
