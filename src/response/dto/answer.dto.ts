import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { OptionDto } from 'src/form/dto/option.dto';
import { QuestionType } from 'src/form/schemas/question.schema';

export class AnswerDto {
  @IsString()
  @IsNotEmpty()
  questionId: string;

  @IsString()
  @IsNotEmpty()
  answerId: string;

  @IsEnum(QuestionType)
  @IsNotEmpty()
  questionType: QuestionType;

  @IsOptional()
  textResponse?: string;

  @IsOptional()
  selectedOptions?: OptionDto[];

  @IsOptional()
  optionId?: string;

  @IsBoolean()
  answeredQuestion?: boolean;

  @IsOptional()
  @IsBoolean()
  booleanQuestion?: boolean;

  @IsBoolean()
  disabledResponse: boolean;

  @IsOptional()
  @IsBoolean()
  correctResponse?: boolean;

  @IsOptional()
  @IsNumber()
  scoreForQuestion?: number;

  @IsOptional()
  @IsNumber()
  timeLeft?: number;
}
