import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { AnswerDto } from './answer.dto';
import { EncryptionType } from 'src/form/constants';

export class CreateResponseDto {
  @IsNumber()
  noOfQuestionsAnswered: number;

  @IsEnum(EncryptionType)
  encryptionType: EncryptionType;

  @IsString()
  submissionDate: string;

  @IsString()
  formSlug: string;

  @IsString()
  totalTimeTaken: string;

  @IsNotEmpty()
  @IsString()
  formId: string;

  @IsArray()
  answers: AnswerDto[];

  @IsObject()
  encryptionDetails: Object;
}
