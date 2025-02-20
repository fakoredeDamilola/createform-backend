import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  IsNumber,
  IsBoolean,
  IsMongoId,
} from 'class-validator';
import { QuestionType } from '../schemas/question.schema';
import { OptionDto } from './option.dto';
import { CreateAnswerDto } from 'src/form/dto/create-answer.dto';
import { FormItemType } from '../constants';

export class QuestionDto {
  @IsNotEmpty()
  @IsString()
  questionId: string;

  @IsNotEmpty()
  @IsString()
  questionFormat: string;

  @IsOptional()
  @IsString()
  questionDescription?: string;

  @IsNotEmpty()
  @IsBoolean()
  required: boolean;

  @IsOptional()
  @IsBoolean()
  multipleSelection?: boolean;

  @IsOptional()
  @IsBoolean()
  timeLimit?: boolean;

  @IsOptional()
  @IsBoolean()
  characterLimit?: boolean;

  @IsOptional()
  @IsString()
  maxCharacters?: string;

  @IsArray()
  questionText: string[];

  @IsNotEmpty()
  @IsNumber()
  questionNumber: number;

  @IsNotEmpty()
  @IsEnum(QuestionType)
  questionType: QuestionType;

  @IsNotEmpty()
  @IsEnum(FormItemType)
  formItemType: FormItemType;

  @IsOptional()
  correctAnswer?: CreateAnswerDto;

  @IsOptional()
  @IsArray()
  options?: OptionDto[];

  @IsNotEmpty()
  @IsMongoId()
  formId: string;
}
