import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class OptionDto {
  @IsNotEmpty()
  @IsString()
  optionId: string;

  @IsNotEmpty()
  @IsString()
  optionText: string;

  @IsNotEmpty()
  @IsString()
  optionLabel: string;

  @IsNotEmpty()
  @IsBoolean()
  selectedOption: boolean;
}
