import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
  @Prop()
  user: string;

  @Prop()
  title: string;

  @Prop()
  message: string;

  @Prop({ default: false })
  seen: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
