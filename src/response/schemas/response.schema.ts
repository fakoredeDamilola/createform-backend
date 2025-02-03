import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, {
  HydratedDocument,
  Schema as MongooseSchema,
  Types,
} from 'mongoose';
import { QuestionType } from '../../form/schemas/question.schema';

export type ResponseDocument = HydratedDocument<Response>;

@Schema({ timestamps: true })
export class Response {
  @Prop()
  formSlug: string;

  @Prop()
  noOfQuestionsAnswered?: number;

  @Prop({ type: Boolean, default: false })
  responseSubmitted: boolean;

  @Prop()
  encryptionType?: string;

  @Prop()
  totalTimeTaken: string;

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
        textResponse: { type: String },
        optionIds: [{ type: String }],
        booleanQuestion: { type: Boolean },
        answerId: { type: String },
        optionId: { type: String },
        answeredQuestion: { type: Boolean },
        disabledResponse: { type: Boolean },
        timeLeft: { type: Number },
        scoreForQuestion: { type: Number },
      },
    ],
    required: true,
  })
  answers: [
    {
      questionId: Types.ObjectId;
      questionType: QuestionType;
      textResponse?: string;
      optionIds?: string[];
      optionId?: string;
      answerId: string;
      timeLeft: number;
      booleanQuestion?: Boolean;
      answeredQuestion?: Boolean;
      disabledResponse: boolean;
      scoreForQuestion: number;
    },
  ];

  @Prop({ type: Object, default: {} })
  encryptionDetails?: Record<string, any>;
}

export const ResponseSchema = SchemaFactory.createForClass(Response);
