import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
// Create a type alias for the document
export type TransitionsDocument = HydratedDocument<Transitions>;

// Define the schema
@Schema({ timestamps: true })
export class Transitions {
  @Prop()
  amount: number;

  @Prop()
  payAmount: number;

  @Prop({ default: 'PENDING' })
  payoutStatus: string;

  @Prop({ unique: true })
  transitions_id: string;

  @Prop({
    required: true,
    default: 'pending',
  })
  status: string;

  @Prop()
  subtitle: string;

  @Prop()
  title: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true, default: false })
  completePayment: boolean;

  @Prop()
  user: mongoose.Schema.Types.ObjectId;

  @Prop()
  brand: mongoose.Schema.Types.ObjectId;

  @Prop()
  typeDocId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  data: any;
}

// Create the schema factory
export const TransitionsSchema = SchemaFactory.createForClass(Transitions);
