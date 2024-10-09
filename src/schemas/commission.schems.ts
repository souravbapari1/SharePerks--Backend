import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CommissionDocument = Commission & Document;

@Schema()
export class Commission {
  @Prop({ required: true })
  provider_id: any;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  commission: number;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  store_name: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  provider: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  typeId: string;

  @Prop({ required: true })
  currency: string;

  @Prop({ default: false })
  manual: boolean;

  @Prop({
    type: {
      name: { type: String, required: true },
      userId: { type: String, required: true },
      type: { type: String, required: true },
      docId: { type: String, required: true },
      brand: { type: String, required: true },
      stock: { type: String, required: true },
    },
    required: true,
  })
  data: {
    name: string;
    userId: string;
    type: string;
    docId: string;
    brand: string;
    stock: string;
  };

  @Prop({ required: true })
  date: string;

  @Prop({ type: Object })
  response: any; // Use `any` for flexibility or specify a concrete type if you know it
}

export const CommissionSchema = SchemaFactory.createForClass(Commission);
