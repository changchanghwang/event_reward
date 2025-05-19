import { Inject, Injectable } from '@nestjs/common';
import { FindCondition, ActivityRepository } from './repository';
import { Activity } from '../domain/model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { conflict, internalServerError, notFound } from '@libs/exceptions';
import { Repository } from '@libs/ddd/repository';
import { DddEvent } from '@libs/ddd/event';
import { ClientKafka } from '@nestjs/microservices';
import { EVENT_SERVER_EVENT_TOPIC } from '@libs/kafka';

@Injectable()
export class ActivityRepositoryImpl
  extends Repository
  implements ActivityRepository
{
  constructor(
    @InjectModel(Activity.name)
    private readonly activityModel: Model<Activity>,
    @InjectModel(DddEvent.name)
    private readonly dddEventModel: Model<DddEvent>,
    @Inject('REQUEST_ID') private readonly requestId: string,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {
    super();
  }

  async save(activities: Activity[]): Promise<void> {
    try {
      const operations = activities.map((activity) => ({
        updateOne: {
          filter: { id: activity.id },
          update: { $set: activity },
          upsert: true,
        },
      }));

      const dddEvents = activities.flatMap((activity) => {
        return activity
          .getPublishedEvents()
          .flatMap((event) => event.withTxId(this.requestId).serialize());
      });

      await this.activityModel.bulkWrite(operations);
      await this.saveEvents(dddEvents);
    } catch (e) {
      if (e.message.includes('duplicate key error')) {
        throw conflict('Activity already exists', {
          errorMessage: '활동이 이미 존재합니다.',
        });
      }
      throw internalServerError(`Failed to save activity: ${e.message}`, {
        errorMessage:
          '알수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      });
    }
  }

  async saveEvents(events: DddEvent[]): Promise<void> {
    await Promise.all(events.map((event) => this.dddEventModel.create(event)));
    events.forEach((event) => {
      this.kafkaClient.emit(EVENT_SERVER_EVENT_TOPIC, JSON.stringify(event));
    });
  }

  async find(
    conditions: FindCondition,
    options?: { limit: number; page: number },
  ): Promise<Activity[]> {
    const { eventIds, userId, participatedOnStart, participatedOnEnd } =
      conditions;

    const activities = this.activityModel.find({
      ...this.strip({
        eventId: this.inValues(eventIds),
        userId,
        participatedOn: this.range(participatedOnStart, participatedOnEnd),
      }),
    });

    if (options) {
      const { limit, page } = options;
      activities.skip((page - 1) * limit).limit(limit);
    }

    return (await activities.exec()).map((activity) => new Activity(activity));
  }

  async count(conditions: FindCondition): Promise<number> {
    const { eventIds, userId, participatedOnStart, participatedOnEnd } =
      conditions;

    return this.activityModel
      .countDocuments({
        ...this.strip({
          eventId: this.inValues(eventIds),
          userId,
          participatedOn: this.range(participatedOnStart, participatedOnEnd),
        }),
      })
      .exec();
  }

  async findOneOrFail(id: Activity['id']): Promise<Activity> {
    const activity = await this.activityModel.findOne({ id });
    if (!activity) {
      throw notFound('Activity not found', {
        errorMessage: '활동을 찾을 수 없습니다.',
      });
    }
    return new Activity(activity);
  }
}
