import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, {
  HydratedDocument,
  Schema as MongooseSchema,
  Types,
} from 'mongoose';
import { QuestionType } from 'src/form/schemas/question.schema';

export type ResponseDocument = HydratedDocument<Response>;

@Schema({ timestamps: true })
export class Response {
  @Prop({ unique: true, sparse: true, default: null })
  email?: string;

  @Prop()
  name?: string;

  @Prop({ unique: true })
  encryptionKey?: string;

  @Prop({ type: String, enum: QuestionType, required: true })
  responseType: QuestionType;

  @Prop({ type: Date, default: Date.now })
  submissionDate: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Form', required: true })
  formId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: [
      {
        questionId: {
          type: MongooseSchema.Types.ObjectId,
          ref: 'Question',
          required: true,
        },
        questionType: { type: String, enum: QuestionType, required: true },
        answer: { type: String },
        multipleChoiceAnswer: [{ type: Number }],
        booleanQuestion: { type: Boolean },
        pickOne: { type: Number },
      },
    ],
    required: true,
  })
  answers: [
    {
      questionId: Types.ObjectId;
      questionType: QuestionType;
      answer?: string;
      multipleChoiceAnswer?: number[];
      booleanQuestion?: Boolean;
      pickOne?: number;
    },
  ];
}

export const ResponseSchema = SchemaFactory.createForClass(Response);
