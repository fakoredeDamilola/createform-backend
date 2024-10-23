import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateResponseDto } from './dto/create-response.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from './schemas/response.schema';
import { Model } from 'mongoose';
import { FormService } from '../form/form.service';

@Injectable()
export class ResponseService {
  constructor(
    @InjectModel(Response.name) private responseModel: Model<Response>,
    private formService: FormService,
  ) {}

  async createNewResponse(createResponseDto: CreateResponseDto) {
    const form = await this.formService.getFormBySlug(
      createResponseDto.slug,
      false,
    );
    if (!form) {
      throw new UnauthorizedException('Form does not exist');
    } else {
      const newResponse: Response = {
        responseType: createResponseDto.responseType,
        answers: createResponseDto.answers as any,
        formId: createResponseDto.formId as any,
        submissionDate: createResponseDto.submissionDate as any,
        encryptionKey: createResponseDto.encryptionKey ?? null,
        email: createResponseDto.email ?? null,
        name: createResponseDto.name ?? null,
      };
      const response = await this.responseModel.create(newResponse);
      if (response) {
        form.responses.push(response._id);
        await form.save();
      }
      return 'response saved';
    }
  }
}
