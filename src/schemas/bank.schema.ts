import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
export type BankDocument = HydratedDocument<Bank>;

@Schema({ timestamps: true })
export class Bank {
  @Prop()
  name: string;

  @Prop()
  accountNumber: string;

  @Prop()
  user: mongoose.Schema.Types.ObjectId;

  @Prop()
  ifscCode: string;
}

export const BankSchema = SchemaFactory.createForClass(Bank);
