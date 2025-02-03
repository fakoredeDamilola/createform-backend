import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { QuestionType } from 'src/form/schemas/question.schema';

export class CreateAnswerDto {
  @IsString()
  questionAnswerId: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  formId: string;

  @IsNotEmpty()
  @IsString()
  questionId: string;

  @IsEnum(QuestionType)
  questionType: QuestionType;

  @IsArray()
  answerResults: string[];
}
