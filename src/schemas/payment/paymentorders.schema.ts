import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
export type GiftCardPaymentsDocument = HydratedDocument<GiftCardPayments>;

@Schema({ timestamps: true })
export class GiftCardPayments {
  @Prop()
  user: string;

  @Prop()
  amount: number;

  @Prop({ enum: ['PENDING', 'COMPLETE', 'EXPIRED'], default: 'PENDING' })
  status: 'PENDING' | 'COMPLETE' | 'EXPIRED';

  @Prop()
  sessionID: string;

  @Prop()
  item: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  data: any;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  paymentResponse: any;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  metaData: any;
}

export const GiftCardPaymentsSchema =
  SchemaFactory.createForClass(GiftCardPayments);
