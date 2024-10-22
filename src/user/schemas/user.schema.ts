import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Form } from '../../form/schemas/form.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  password?: string;

  @Prop({ required: true })
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Form' }] })
  forms: Form[];
}

export const UserSchema = SchemaFactory.createForClass(User);
