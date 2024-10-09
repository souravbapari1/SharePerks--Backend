import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  name: string;

  @Prop()
  referCode: string;

  @Prop({ default: 'public/user.png' })
  image: string;

  @Prop({ lowercase: true })
  email: string;

  @Prop()
  referByCode: string;

  @Prop()
  referByUser: string;

  @Prop({ default: true })
  referPaymentComplete: boolean;

  @Prop({ unique: true })
  mobile: number;

  @Prop()
  otp: number;

  @Prop()
  expOtp: Date;

  @Prop({ default: 0 })
  walletAmount: number;

  @Prop({ default: false })
  completeProfile: boolean;

  @Prop({ default: false })
  brokerConnected: boolean;

  @Prop({ default: 'USER' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
