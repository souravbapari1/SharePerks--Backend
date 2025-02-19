import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
export type GiftCardErrorsDocument = HydratedDocument<GiftCardErrors>;

@Schema({ timestamps: true })
export class GiftCardErrors {
  @Prop()
  user: string;

  @Prop()
  amount: number;

  @Prop()
  payAmount: number;

  @Prop({ default: false })
  retry: boolean;

  @Prop({ default: false })
  refund: boolean;

  @Prop({ default: false })
  resolved: boolean;

  @Prop()
  refundNote: string;

  @Prop()
  orderID: string;

  @Prop()
  paymentID: string;

  @Prop({ default: 0 })
  retryCount: number;

  @Prop()
  provider: 'WHOOW' | 'GIFTER';

  @Prop({ type: mongoose.Schema.Types.Mixed })
  data: any;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  errorResponse: any;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  metaData: any;
}

export const GiftCardErrorsSchema =
  SchemaFactory.createForClass(GiftCardErrors);
