import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { QuestionType } from 'src/form/schemas/question.schema';
import { AnswerDto } from './answer.dto';

export class CreateResponseDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  encryptionKey?: string;

  @IsEnum(QuestionType)
  responseType: QuestionType;

  @IsString()
  submissionDate: string;

  @IsNotEmpty()
  @IsString()
  formId: string;

  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsArray()
  answers: [AnswerDto];
}
