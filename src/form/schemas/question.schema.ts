import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type QuestionDocument = HydratedDocument<Question>;

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  SHORT_ANSWER = 'SHORT_ANSWER',
  PARAGRAPH = 'PARAGRAPH',
  PICK_ONE = 'PICK_ONE',
}

@Schema({ timestamps: true })
export class Question {
  @Prop({ required: true })
  questionText: string;

  @Prop({ type: String, enum: QuestionType, required: true })
  questionType: QuestionType;

  @Prop([String])
  options?: string[];

  @Prop()
  correctAnswer?: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Form' })
  formID: Types.ObjectId;

  @Prop()
  explanation?: string;

  @Prop()
  timeLimit?: number;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
