import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
export class CreateNewFormDto {
  @IsNotEmpty()
  @IsString()
  formName: string;

  @IsOptional()
  @IsString()
  formDescription?: string;
}
