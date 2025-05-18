import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from './repository';
import { User } from '../domain/model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User as UserEntity } from '../domain/model'; // UserDocument 또는 적절한 Mongoose 스키마/모델 클래스로 변경해야 합니다.
import { conflict, internalServerError, notFound } from '@libs/exceptions';
import { DddEvent } from '@libs/ddd/event';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectModel(UserEntity.name) private readonly userModel: Model<UserEntity>,
    @InjectModel(DddEvent.name) private readonly eventModel: Model<DddEvent>,
    @Inject('REQUEST_ID') private readonly requestId: string,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async save(users: User[]): Promise<void> {
    try {
      const operations = users.map((user) => ({
        updateOne: {
          filter: { id: user.id },
          update: { $set: user },
          upsert: true,
        },
      }));
      const events = users.flatMap((user) => {
        return user
          .getPublishedEvents()
          .flatMap((event) => event.withTxId(this.requestId).serialize());
      });

      await this.userModel.bulkWrite(operations);
      await this.saveEvents(events);
    } catch (e) {
      if (e.message.includes('duplicate key error')) {
        throw conflict('User already exists', {
          errorMessage: '유저가 이미 존재합니다.',
        });
      }
      throw internalServerError(`Failed to save user: ${e.message}`, {
        errorMessage:
          '알수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      });
    }
  }

  async saveEvents(events: DddEvent[]): Promise<void> {
    await Promise.all(events.map((event) => this.eventModel.create(event)));
    events.forEach((event) => {
      this.kafkaClient.emit('auth-server-ddd-event', event);
    });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    return user ? new User(user) : null;
  }

  async findOneOrFail(id: string): Promise<User> {
    const user = await this.userModel.findOne({ id });
    if (!user) {
      throw notFound('User not found.', {
        errorMessage: '존재하지 않는 사용자입니다.',
      });
    }

    return new User(user);
  }
}
