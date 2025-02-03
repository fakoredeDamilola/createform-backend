import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { FormService } from './form.service';
import { CreateNewFormDto } from './dto/create-new-form.dto';
import { UpdateFormDto } from './dto/update-form-dto';
import { Public } from '../decorators/public-routes.decorator';
import { UpdateFormInsightDto } from './dto/update-form-insight.dto';
import { QuestionDto } from './dto/question.dto';
import { StaticPageDto } from './dto/static-page.dto';

@Controller('form')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Get('/get')
  async getAllUserForms(@Request() req) {
    return this.formService.getAllUserForms(req.user.userId);
  }

  @Get('/get/:formID')
  async getFormByFormID(@Param('formID') formID: string) {
    return this.formService.getFormByFormID(formID);
  }

  @Get('/get/:questionId')
  async getQuestionByQuestionId(@Param('questionId') questionId: string) {
    return this.formService.getQuestionByIdWithAnswer(questionId);
  }

  @Public()
  @Get('/:slug')
  async getFormBySlug(
    @Param('slug') slug: string,
    @Query('answer') answer: string,
  ) {
    return this.formService.getFormBySlug(slug, true, answer);
  }

  @Post('/new')
  async createNewForm(
    @Body() createNewFormDto: CreateNewFormDto,
    @Request() req,
  ) {
    return this.formService.createNewForm(createNewFormDto, req.user);
  }

  @Post('/question/new')
  async createNewQuestion(@Body() questionDto: QuestionDto, @Request() req) {
    return this.formService.createNewQuestion(questionDto, req.user);
  }

  @Put('/update')
  async updateForm(@Body() updateFormDto: UpdateFormDto) {
    console.log({ updateFormDto });
    return this.formService.updateForm(updateFormDto);
  }

  @Public()
  @Put('/update/insight/:formID')
  async updateFormInsight(
    @Param('formID') formID: string,
    @Body() updateFormInsightDto: UpdateFormInsightDto,
  ) {
    return this.formService.updateFormInsight(formID, updateFormInsightDto);
  }

  @Delete('/delete/:formID')
  async deleteForm(@Param('formID') formID: string, @Request() req) {
    return this.formService.deleteForm(formID, req.user.userId);
  }

  @Delete('/delete/question/:questionId/:formId')
  async deleteQuestion(
    @Param('questionId') questionId: string,
    @Param('formId') formId: string,
  ) {
    return this.formService.deleteQuestion(questionId, formId);
  }
}
