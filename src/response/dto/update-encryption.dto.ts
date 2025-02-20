import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class UpdateEncryptionDto {
  @IsNotEmpty()
  @IsString()
  responseId: string;

  @IsObject()
  encryptionDetails: Object;
}
