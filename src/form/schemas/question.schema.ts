import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Option, OptionSchema } from './options.schema';
import { FormItemType } from '../constants';

export type QuestionDocument = HydratedDocument<Question>;

export enum QuestionType {
  short_text = 'Short Text',
  long_text = 'Long Text',
  multiple_choice = 'Multiple Choice',
  statement = 'Statement',
  email = 'Email',
  number = 'Number',
  boolean = 'Boolean',
}

@Schema({ timestamps: true })
export class Question {
  @Prop({ required: true, unique: true })
  questionId: string;

  @Prop({ required: true })
  questionFormat: string;

  @Prop()
  questionDescription?: string;

  @Prop({ required: true })
  required: boolean;

  @Prop()
  multipleSelection?: boolean;

  @Prop()
  timeLimit?: boolean;

  @Prop()
  totalTime?: number;

  @Prop()
  timeLeft?: number;

  @Prop()
  disabled: boolean;

  @Prop()
  characterLimit?: boolean;

  @Prop()
  maxCharacters?: string;

  @Prop()
  questionText?: string;

  @Prop({ required: true })
  questionNumber: number;

  @Prop({ type: String, enum: QuestionType, required: true })
  questionType: QuestionType;

  @Prop({ type: String, enum: FormItemType, required: true })
  formItemType: FormItemType;

  @Prop({ type: Object })
  correctAnswer: {
    description?: string;
    questionAnswerId: string;
    formId: mongoose.Schema.Types.ObjectId;
    questionId: mongoose.Schema.Types.ObjectId;
    answerResults: string[];
  };

  @Prop({ type: [OptionSchema] })
  options?: Option[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Form' })
  formId: Types.ObjectId;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
