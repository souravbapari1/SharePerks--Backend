import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
// Create a type alias for the document
export type PayoutDocument = HydratedDocument<Payout>;

// Define the schema
@Schema({ timestamps: true })
export class Payout {
  @Prop()
  amount: number;

  @Prop({
    required: true,
    enum: ['pending', 'complete', 'failed', 'cancel'],
    default: 'pending',
  })
  status: 'pending' | 'complete' | 'failed' | 'cancel';

  @Prop()
  subtitle: string;

  @Prop()
  title: string;

  @Prop()
  user: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  bank: any;

  @Prop()
  upi: string;
}

// Create the schema factory
export const PayoutSchema = SchemaFactory.createForClass(Payout);
