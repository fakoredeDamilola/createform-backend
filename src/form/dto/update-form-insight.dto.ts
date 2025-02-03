import { IsOptional, IsNumber } from 'class-validator';
export class UpdateFormInsightDto {
  @IsOptional()
  @IsNumber()
  views: number;

  @IsOptional()
  @IsNumber()
  starts: number;

  @IsOptional()
  @IsNumber()
  submitted: number;
}
