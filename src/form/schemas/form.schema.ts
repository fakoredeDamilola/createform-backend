import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, {
  HydratedDocument,
  Schema as MongooseSchema,
  Types,
} from 'mongoose';
import { EncryptionType, FormItemType, FormStaticType } from '../constants';

export type FormDocument = HydratedDocument<Form>;

@Schema({ timestamps: true })
export class Form {
  @Prop({ required: true })
  formName: string;

  @Prop({ required: false, default: false })
  publish: boolean;

  @Prop({ type: Object })
  formSettings: {
    createFormBranding: boolean;
    navigationArrow: boolean;
    progressBar: boolean;
    questionNumber: boolean;
    addAnswerToQuestion: boolean;
    addTimeLimitToForm: boolean;
    popQuiz: boolean;
    encryption: boolean;
  };

  @Prop({ type: Object })
  encryptionDetails: Record<string, any>;

  @Prop({
    type: {
      views: {
        type: Number,
        default: 0,
      },
      starts: {
        type: Number,
        default: 0,
      },
      submitted: {
        type: Number,
        default: 0,
      },
    },
  })
  formResponseInsights: {
    views: number;
    starts: number;
    submitted: number;
  };

  @Prop({ type: Number, default: 0 })
  noOfQuestions: number;

  @Prop()
  formDescription: string;

  @Prop()
  totalFormTimeLimit: string;

  @Prop()
  formType: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  startingDate: Date;

  @Prop({ type: Date, default: Date.now })
  endingDate: Date;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }])
  questions: Types.ObjectId[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Response' }])
  responses: Types.ObjectId[];

  @Prop()
  slug: string;

  @Prop({
    type: {
      pageTitle: String,
      pageDescription: String,
      questionId: String,
      instructions: [String],
      formItemType: {
        type: String,
        enum: FormItemType,
        default: FormItemType.STATIC,
      },
      formStaticType: {
        type: String,
        enum: FormStaticType,
        default: FormStaticType.START,
      },
    },
  })
  formStartPage: {
    pageTitle: string;
    pageDescription: string;
    questionId: string;
    instructions: string[];
    formItemType: FormItemType;
    formStaticType: FormStaticType;
  };

  @Prop({
    type: {
      pageTitle: String,
      pageDescription: String,
      instructions: [String],
      questionId: String,
      formItemType: {
        type: String,
        enum: FormItemType,
        default: FormItemType.STATIC,
      },
      formStaticType: {
        type: String,
        enum: FormStaticType,
        default: FormStaticType.END,
      },
    },
  })
  formEndPage: {
    pageTitle: string;
    pageDescription: string;
    questionId: string;
    instructions?: string[];
    formItemType: FormItemType;
    formStaticType: FormStaticType;
  };
}

export const FormSchema = SchemaFactory.createForClass(Form);
