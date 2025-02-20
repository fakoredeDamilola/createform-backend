import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { FormItemType, FormStaticType } from '../constants';

export class StaticPageDto {
  @IsString()
  pageTitle: string;

  @IsString()
  pageDescription: string;

  @IsNotEmpty()
  @IsMongoId()
  formId: string;

  @IsArray()
  @IsOptional()
  instructions: string[];

  @IsNotEmpty()
  @IsEnum(FormItemType)
  formItemType: FormItemType;

  @IsString()
  questionId: string;

  @IsNotEmpty()
  @IsEnum(FormStaticType)
  formStaticType: FormStaticType;

  @IsBoolean()
  showPage: boolean;
}
