import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  IsNumber,
} from 'class-validator';
import { QuestionType } from '../schemas/question.schema';
export class QuestionDto {
  @IsNotEmpty()
  @IsString()
  questionText: string;

  @IsNotEmpty()
  @IsEnum(QuestionType)
  questionType: QuestionType;

  @IsOptional()
  @IsArray()
  options: [string];

  @IsOptional()
  @IsNumber()
  correctAnswer: number;

  @IsOptional()
  @IsString()
  explanation: string;

  @IsOptional()
  @IsNumber()
  timeLimit: number;
}
