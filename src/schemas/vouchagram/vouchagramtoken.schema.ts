import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VouchagramTokenDocument = HydratedDocument<VouchagramToken>;

@Schema({ timestamps: true })
export class VouchagramToken {
  @Prop()
  token: string;

  @Prop()
  generateAt: Date;
}

export const VouchagramTokenSchema =
  SchemaFactory.createForClass(VouchagramToken);
