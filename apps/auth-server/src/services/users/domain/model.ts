import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v7 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, trim: true })
  id: string;

  @Prop({ required: true, unique: true, trim: true })
  username: string;

  @Prop({ required: true, unique: true, trim: true })
  email: string;

  @Prop({ required: true })
  @Exclude()
  password: string;

  constructor(args: {
    id: string;
    username: string;
    email: string;
    password: string;
  }) {
    this.id = args.id;
    this.username = args.username;
    this.email = args.email;
    this.password = args.password;
  }

  static async from({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) {
    const id = v7();
    const hashedPassword = await bcrypt.hash(password, 10);

    return new User({ id, username, email, password: hashedPassword });
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
