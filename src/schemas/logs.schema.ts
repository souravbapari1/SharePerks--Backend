import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
export type LogDocument = HydratedDocument<Log>;

@Schema({ timestamps: true })
export class Log {
  @Prop()
  title: string;

  @Prop()
  type: string;

  @Prop()
  description: string;

  @Prop()
  user: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  data: any;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  timeQuery: any;
}

export const LogSchema = SchemaFactory.createForClass(Log);
