import { IsOptional, IsString } from 'class-validator';
import { CreateResponseDto } from './create-response.dto';

export class UpdateResponseDto extends CreateResponseDto {
  @IsOptional()
  @IsString()
  responseId?: string;

  @IsOptional()
  @IsString()
  responseType?: string;
}
