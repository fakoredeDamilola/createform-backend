import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateNewFormDto } from './create-new-form.dto';
import { QuestionDto } from './question.dto';
import FormSettingsDto from './form-settings.dto';
import { StaticPageDto } from './static-page.dto';

export class UpdateFormDto extends CreateNewFormDto {
  @IsNotEmpty()
  @IsString()
  _id: string;

  @IsString()
  formType?: string;

  formSettings: FormSettingsDto;

  @IsNumber()
  noOfQuestions?: number;

  @IsOptional()
  @IsString()
  startingDate?: string;

  @IsOptional()
  @IsString()
  endingDate?: string;

  @IsOptional()
  @IsArray()
  questions: QuestionDto[];

  @IsString()
  @IsOptional()
  totalFormTimeLimit: string;

  @IsBoolean()
  publish: boolean;

  @IsArray()
  @IsOptional()
  encryptionDetails: string[];

  @IsOptional()
  formStartPage: StaticPageDto;

  @IsOptional()
  formEndPage: StaticPageDto;
}
