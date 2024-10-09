import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ timestamps: true })
export class Admin {
  @Prop()
  name: string;

  @Prop()
  image: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ default: 'ADMIN' })
  role: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
