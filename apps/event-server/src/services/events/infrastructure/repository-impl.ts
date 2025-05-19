import { Injectable } from '@nestjs/common';
import { EventRepository, FindCondition } from './repository';
import { Event, EventStatus, EventType } from '../domain/model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { conflict, internalServerError, notFound } from '@libs/exceptions';
import { Repository } from '@libs/ddd/repository';
import { EventSpec } from '@services/events/domain/specs/event-spec';
import { FindOption } from '@libs/db';

@Injectable()
export class EventRepositoryImpl extends Repository implements EventRepository {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
  ) {
    super();
  }

  async save(events: Event[]): Promise<void> {
    try {
      const operations = events.map((event) => ({
        updateOne: {
          filter: { id: event.id },
          update: { $set: event },
          upsert: true,
        },
      }));
      await this.eventModel.bulkWrite(operations);
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
    conditions: FindCondition,
    options?: { limit: number; page: number },
  ): Promise<Event[]> {
    const { type, status, startAtPeriod, endAtPeriod } = conditions;

    const events = this.eventModel.find({
      ...this.strip({
        type,
        status,
        startAt: this.range(startAtPeriod?.from, startAtPeriod?.to),
        endAt: this.range(endAtPeriod?.from, endAtPeriod?.to),
      }),
    });

    if (options) {
      const { limit, page } = options;
      events.skip((page - 1) * limit).limit(limit);
    }

    return (await events.exec()).map((event) => new Event(event));
  }

  async count(conditions: FindCondition): Promise<number> {
    const { type, status, startAtPeriod, endAtPeriod } = conditions;

    return this.eventModel
      .countDocuments({
        ...this.strip({
          type,
          status,
          startAt: this.range(startAtPeriod.from, startAtPeriod.to),
          endAt: this.range(endAtPeriod.from, endAtPeriod.to),
        }),
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

  async findSatisfying(
    spec: EventSpec,
    options?: FindOption,
  ): Promise<Event[]> {
    return spec.findSatisfiedElementsFrom(this, options);
  }

  async countSatisfying(spec: EventSpec): Promise<number> {
    return spec.countSatisfiedElementsFrom(this);
  }
}
