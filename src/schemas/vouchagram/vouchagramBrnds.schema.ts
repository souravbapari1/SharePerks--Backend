import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type VouchagramBrandsDocument = HydratedDocument<VouchagramBrands>;

@Schema({ timestamps: true })
export class VouchagramBrands {
  @Prop({ unique: true })
  brandProductCode: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  data: any;
}

export const VouchagramBrandsSchema =
  SchemaFactory.createForClass(VouchagramBrands);
