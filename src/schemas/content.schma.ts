import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
export type ContentDocument = HydratedDocument<Content>;

@Schema({ timestamps: true })
export class Content {
  @Prop()
  content_id: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  data: any;
}

export const ContentSchema = SchemaFactory.createForClass(Content);
