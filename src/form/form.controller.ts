import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { FormService } from './form.service';
import { CreateNewFormDto } from './dto/create-new-form.dto';
import { UpdateFormDto } from './dto/update-form-dto';
import { Public } from 'src/decorators/public-routes.decorator';

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

  @Public()
  @Get('/:slug')
  async getFormBySlug(@Param('slug') slug: string) {
    console.log({ slug });
    return this.formService.getFormBySlug(slug);
  }

  @Post('/new')
  async createNewForm(
    @Body() createNewFormDto: CreateNewFormDto,
    @Request() req,
  ) {
    return this.formService.createNewForm(createNewFormDto, req.user);
  }

  @Put('/update')
  async updateForm(@Body() updateFormDto: UpdateFormDto) {
    return this.formService.updateForm(updateFormDto);
  }
}
