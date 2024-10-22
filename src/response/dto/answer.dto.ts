import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { QuestionType } from 'src/form/schemas/question.schema';

export class AnswerDto {
  @IsString()
  @IsNotEmpty()
  questionId: string;

  @IsEnum(QuestionType)
  @IsNotEmpty()
  questionType: QuestionType;

  @IsOptional()
  answer?: string;

  @IsOptional()
  multipleChoiceAnswer?: number[];

  @IsOptional()
  pickOne?: number;

  @IsOptional()
  @IsBoolean()
  booleanQuestion?: Boolean;
}
