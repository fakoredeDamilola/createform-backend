import { forwardRef, Module } from '@nestjs/common';
import { FormService } from './form.service';
import { FormController } from './form.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Form, FormSchema } from './schemas/form.schema';
import { Question, QuestionSchema } from './schemas/question.schema';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { Response, ResponseSchema } from 'src/response/schemas/response.schema';

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
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Response.name,
        schema: ResponseSchema,
      },
    ]),
  ],
  controllers: [FormController],
  providers: [FormService],
})
export class FormModule {}
