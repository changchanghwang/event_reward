import { Injectable } from '@nestjs/common';
import { EventRepository } from './repository';
import { Event, EventStatus, EventType } from '../domain/model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { conflict, internalServerError, notFound } from '@libs/exceptions';
import { Repository } from '@libs/ddd/repository';

@Injectable()
export class EventRepositoryImpl extends Repository implements EventRepository {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
  ) {
    super();
  }

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

  async find(
    conditions: { type?: EventType; status?: EventStatus },
    options?: { limit: number; page: number },
  ): Promise<Event[]> {
    const { type, status } = conditions;

    const events = this.eventModel.find({
      ...this.strip({ type, status }),
    });

    if (options) {
      const { limit, page } = options;
      events.skip((page - 1) * limit).limit(limit);
    }

    return (await events.exec()).map((event) => new Event(event));
  }

  async count(conditions: {
    type?: EventType;
    status?: EventStatus;
  }): Promise<number> {
    const { type, status } = conditions;

    return this.eventModel
      .countDocuments({
        ...this.strip({ type, status }),
      })
      .exec();
  }

  async findOneOrFail(id: Event['id']): Promise<Event> {
    const event = await this.eventModel.findOne({ id });

    if (!event) {
      throw notFound('Event not found', {
        errorMessage: '존재하지 않는 이벤트입니다.',
      });
    }

    return new Event(event);
  }
}
