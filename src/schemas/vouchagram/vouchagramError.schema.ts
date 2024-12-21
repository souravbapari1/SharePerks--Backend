import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type VouchagramErrorDocument = HydratedDocument<VouchagramError>;

@Schema({ timestamps: true })
export class VouchagramError {
  @Prop()
  BrandProductCode: string;

  @Prop()
  Denomination: string;

  @Prop()
  Quantity: number;

  @Prop()
  ExternalOrderId: string;

  @Prop()
  user: string;

  @Prop()
  paymentId: string;

  @Prop({ default: false })
  isRetry: boolean;
}

export const vouchagramErrorSchema =
  SchemaFactory.createForClass(VouchagramError);
