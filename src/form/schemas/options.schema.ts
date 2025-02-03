// options.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OptionDocument = HydratedDocument<Option>;

@Schema()
export class Option {
  @Prop()
  optionId: string;

  @Prop()
  optionText: string;

  @Prop()
  optionLabel: string;

  @Prop()
  selectedOption: boolean;
}

export const OptionSchema = SchemaFactory.createForClass(Option);
