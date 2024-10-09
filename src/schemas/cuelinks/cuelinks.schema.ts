import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
export type CuelinksDocument = HydratedDocument<Cuelinks>;

@Schema({ timestamps: true })
export class Cuelinks {
  @Prop({ unique: true })
  cuelink_id: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  data: any;
}

export const CuelinksSchema = SchemaFactory.createForClass(Cuelinks);
