import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
export type WhoohCardDocument = HydratedDocument<WhooCard>;

@Schema({ timestamps: true })
export class WhooCard {
  @Prop()
  description: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  pricing: any;

  @Prop({ default: false })
  isEnable: boolean;

  @Prop()
  stockISIN: string;

  @Prop()
  GiftCardImage: string;

  @Prop()
  previewImage: string;

  @Prop()
  brandName: string;

  @Prop()
  taq: string;

  @Prop({ default: 'whoow' })
  type: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  data: any;
}

export const WhooCardSchema = SchemaFactory.createForClass(WhooCard);
