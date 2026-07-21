import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// export type CategoryDocument = Category & Document;

@Schema()
export class Category extends Document {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true, unique: true })
  slug!: string;

  @Prop({ required: false })
  description?: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
