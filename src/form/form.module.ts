import { Module } from '@nestjs/common';
import { FormService } from './form.service';
import { FormController } from './form.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Form, FormSchema } from './schemas/form.schema';
import { Question, QuestionSchema } from './schemas/question.schema';

@Module({
  exports: [FormService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Form.name,
        schema: FormSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Question.name,
        schema: QuestionSchema,
      },
    ]),
  ],
  controllers: [FormController],
  providers: [FormService],
})
export class FormModule {}
