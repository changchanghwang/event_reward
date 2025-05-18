import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v7 } from 'uuid';
import { Exclude } from 'class-transformer';
import type { PasswordHashService } from './services';
import { unauthorized } from '@libs/exceptions';
import { AggregateRoot } from '@libs/ddd/aggregate';
import { UserRegisteredEvent } from '@services/users/domain/events';

export type UserDocument = User & Document;

export enum Role {
  USER = 'USER',
  OPERATOR = 'OPERATOR',
  AUDITOR = 'AUDITOR',
  ADMIN = 'ADMIN',
}

@Schema({ timestamps: true })
export class User extends AggregateRoot {
  @Prop({ required: true, unique: true, trim: true })
  id: string;

  @Prop({ required: true, unique: true, trim: true })
  username: string;

  @Prop({ required: true, unique: true, trim: true })
  email: string;

  @Prop({ required: true })
  @Exclude()
  password: string;

  @Prop({ required: true })
  role: Role;

  constructor(args: {
    id: string;
    username: string;
    email: string;
    password: string;
    role: Role;
  }) {
    super();
    if (args) {
      this.id = args.id;
      this.username = args.username;
      this.email = args.email;
      this.password = args.password;
      this.role = args.role;

      this.publishEvent(
        new UserRegisteredEvent(this.id, this.username, this.email, this.role),
      );
    }
  }

  static async from({
    username,
    email,
    password,
    passwordHashService,
  }: {
    username: string;
    email: string;
    password: string;
    passwordHashService: PasswordHashService;
  }) {
    const id = v7();
    const hashedPassword = await passwordHashService.hash(password);

    return new User({
      id,
      username,
      email,
      password: hashedPassword,
      role: Role.USER, // 초기값은 USER
    });
  }

  async validatePassword(
    password: string,
    passwordHashService: PasswordHashService,
  ) {
    const isValid = await passwordHashService.compare(password, this.password);
    if (!isValid) {
      throw unauthorized('Invalid password.', {
        errorMessage: '이메일 또는 비밀번호가 일치하지 않습니다.',
      });
    }
  }

  changeRole(role: Role) {
    this.role = role;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
