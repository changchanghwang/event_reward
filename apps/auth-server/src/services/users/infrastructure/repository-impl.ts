import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository';
import { User } from '../domain/model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User as UserEntity } from '../domain/model'; // UserDocument 또는 적절한 Mongoose 스키마/모델 클래스로 변경해야 합니다.

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectModel(UserEntity.name) private readonly userModel: Model<UserEntity>,
  ) {}

  async save(users: User[]): Promise<void> {
    await this.userModel.insertMany(users);
  }
}
