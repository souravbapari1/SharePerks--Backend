import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
export type MyGiftCardsDocument = HydratedDocument<MyGiftCards>;

@Schema({ timestamps: true })
export class MyGiftCards {
  @Prop()
  user: string;

  @Prop()
  amount: number;

  @Prop()
  provider: 'WHOOW' | 'GIFTER';

  @Prop()
  paymentID: string;

  @Prop()
  name: string;

  @Prop()
  code: string;

  @Prop()
  pin: string;

  @Prop()
  expiredDate: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  gifterResponse: any;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  whoowResponse: any;
}

export const MyGiftCardsSchema = SchemaFactory.createForClass(MyGiftCards);
