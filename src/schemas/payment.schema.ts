import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
// Create a type alias for the document
export type PaymentDocument = HydratedDocument<Payment>;

// Define the schema
@Schema({ timestamps: true })
export class Payment {
  @Prop()
  amount: number;

  @Prop({ default: 'GiftCard' })
  type: string;

  @Prop({
    required: true,
    default: 'ACTIVE',
  })
  status: string;

  @Prop()
  brandProductCode: string;

  @Prop({ default: false })
  completePurchase: boolean;

  @Prop()
  denomination: string;

  @Prop()
  user: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  data: any;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  itemData: any;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  giftCard: any;
}

// Create the schema factory
export const PaymentSchema = SchemaFactory.createForClass(Payment);
