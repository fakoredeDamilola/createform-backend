import { IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';
import { EncryptionType } from '../constants';

export default class FormSettingsDto {
  @IsBoolean()
  @IsNotEmpty()
  createFormBranding: boolean;

  @IsBoolean()
  @IsNotEmpty()
  navigationArrow: boolean;

  @IsBoolean()
  @IsNotEmpty()
  progressBar: boolean;

  @IsBoolean()
  @IsNotEmpty()
  questionNumber: boolean;

  @IsBoolean()
  @IsNotEmpty()
  addAnswerToQuestion: boolean;

  @IsBoolean()
  @IsNotEmpty()
  popQuiz: boolean;

  @IsBoolean()
  @IsNotEmpty()
  addTimeLimitToForm: boolean;

  @IsEnum(EncryptionType)
  encryptionType: EncryptionType;

  @IsBoolean()
  encryption: boolean;
}
