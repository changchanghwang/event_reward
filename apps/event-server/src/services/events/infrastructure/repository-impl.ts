import { Injectable } from '@nestjs/common';
import { EventRepository } from './repository';
import { Event } from '../domain/model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { conflict, internalServerError } from '@libs/exceptions';

@Injectable()
export class EventRepositoryImpl implements EventRepository {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
  ) {}

  async save(events: Event[]): Promise<void> {
    try {
      await this.eventModel.insertMany(events);
    } catch (e) {
      if (e.message.includes('duplicate key error')) {
        throw conflict('Event already exists', {
          errorMessage: '이벤트가 이미 존재합니다.',
        });
      }
      throw internalServerError(`Failed to save event: ${e.message}`, {
        errorMessage:
          '알수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      });
    }
  }
}
