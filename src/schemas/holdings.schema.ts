import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type HoldingsDocument = HydratedDocument<Holdings>;

@Schema({ timestamps: true })
export class Holdings {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user' })
  user: mongoose.Schema.Types.ObjectId;

  // If the data field is truly dynamic
  @Prop({ type: mongoose.Schema.Types.Mixed })
  data: any;
}

export const HoldingsSchema = SchemaFactory.createForClass(Holdings);
