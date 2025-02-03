import { IsBoolean, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { AnswerDto } from './answer.dto';

export class UpdateAnswerInResponseDto {
  @IsNotEmpty()
  @IsString()
  formId: string;

  @IsBoolean()
  popQuiz: boolean;

  @IsBoolean()
  responseSubmitted: boolean;

  @IsNotEmpty()
  @IsString()
  responseId: string;

  @IsObject()
  answer: AnswerDto;
}
