import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateNewFormDto } from './create-new-form.dto';
import { QuestionDto } from './question.dto';
import { EncryptionType } from '../constants';

export class UpdateFormDto extends CreateNewFormDto {
  @IsNotEmpty()
  @IsString()
  formId: string;

  @IsNotEmpty()
  @IsString()
  formType: string;

  @IsOptional()
  @IsString()
  startingDate?: string;

  @IsOptional()
  @IsString()
  endingDate?: string;

  @IsOptional()
  encryption?: boolean;

  @IsEnum(EncryptionType)
  encryptionType: EncryptionType;

  @IsOptional()
  @IsArray()
  questions: QuestionDto[];
}
