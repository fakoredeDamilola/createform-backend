import { Body, Controller, Post } from '@nestjs/common';
import { CreateResponseDto } from './dto/create-response.dto';
import { ResponseService } from './response.service';

@Controller('response')
export class ResponseController {
  constructor(private readonly responseService: ResponseService) {}

  @Post('/create')
  createNewResponse(@Body() createResponseDto: CreateResponseDto) {
    return this.responseService.createNewResponse(createResponseDto);
  }
}
