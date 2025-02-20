import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreateResponseDto } from './dto/create-response.dto';
import { ResponseService } from './response.service';
import { Public } from 'src/decorators/public-routes.decorator';
import { UpdateResponseDto } from './dto/update-response.dto';
import { UpdateAnswerInResponseDto } from './dto/update-answer-in-response.dto';
import { UpdateEncryptionDto } from './dto/update-encryption.dto';

@Public()
@Controller('response')
export class ResponseController {
  constructor(private readonly responseService: ResponseService) {}

  @Post('/create')
  createNewResponse(@Body() updateResponseDto: UpdateResponseDto) {
    return this.responseService.updateOrCreateNewResponse(updateResponseDto);
  }

  @Post('/update/answer')
  updateAnswerInResponse(
    @Body() updateAnswerInResponseDto: UpdateAnswerInResponseDto,
  ) {
    return this.responseService.updateAnswerInResponse(
      updateAnswerInResponseDto,
    );
  }

  @Put('/update/encryption-details')
  updateEncryptionDetailsInResponse(
    @Body() updateEncryptionDto: UpdateEncryptionDto,
  ) {
    return this.responseService.updateEncryptionDetailsInResponse(
      updateEncryptionDto,
    );
  }

  @Get('/get/:responseId')
  async getResponseByResponseId(@Param('responseId') responseId: string) {
    return this.responseService.getResponseByResponseId(responseId);
  }
}
