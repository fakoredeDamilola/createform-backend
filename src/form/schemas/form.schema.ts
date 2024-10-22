import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, {
  HydratedDocument,
  Schema as MongooseSchema,
  Types,
} from 'mongoose';
import { EncryptionType } from '../constants';

export type FormDocument = HydratedDocument<Form>;

@Schema({ timestamps: true })
export class Form {
  @Prop({ required: true, unique: true })
  formName: string;

  @Prop()
  formDescription: string;

  @Prop()
  formType: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  startingDate: Date;

  @Prop({ type: Date, default: Date.now })
  endingDate: Date;

  @Prop()
  encryption: boolean;

  @Prop({ type: String, enum: EncryptionType, default: EncryptionType.NONE })
  encryptionType: EncryptionType;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }])
  questions: Types.ObjectId[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Response' }])
  responses: Types.ObjectId[];

  @Prop()
  slug: string;
}

export const FormSchema = SchemaFactory.createForClass(Form);
