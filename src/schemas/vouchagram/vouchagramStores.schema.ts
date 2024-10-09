import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type VouchagramStoresDocument = HydratedDocument<VouchagramStores>;

@Schema({ timestamps: true })
export class VouchagramStores {
  @Prop({ unique: true })
  storeId: string;

  @Prop({ type: Object }) // Storing as an object
  data: Record<string, any>; // This ensures data is an object
}

export const VouchagramStoresSchema =
  SchemaFactory.createForClass(VouchagramStores);
