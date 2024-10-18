import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FormDocument = HydratedDocument<Form>;

@Schema()
export class Form {
  @Prop({ required: true, unique: true })
  formName: string;
}

export const FormSchema = SchemaFactory.createForClass(Form);
