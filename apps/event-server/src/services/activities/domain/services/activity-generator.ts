import { add, startOfDay } from '@libs/date';
import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Activity } from '@services/activities/domain/model';
import { ActivityRepository } from '@services/activities/infrastructure/repository';
import { EventType } from '@services/events/domain/model';

@Injectable()
export class ActivityGenerator {
  constructor(
    @Inject('ActivityRepository')
    private readonly activityRepository: ActivityRepository,
  ) {}

  async generate(
    eventId: string,
    userId: string,
    eventType: EventType,
    participatedOn: CalendarDate,
  ) {
    switch (eventType) {
      case EventType.ATTENDANCE:
        return this.generateAttendanceActivity(eventId, userId, participatedOn);
      default:
        throw new Error(`Unsupported event type: ${eventType}`);
    }
  }

  private async generateAttendanceActivity(
    eventId: string,
    userId: string,
    participatedOn: CalendarDate,
  ) {
    const [todayAttendance] = await this.activityRepository.find({
      eventIds: [eventId],
      userId,
      participatedOnStart: startOfDay(new Date(participatedOn)),
      participatedOnEnd: add(startOfDay(new Date(participatedOn)), 1, 'day'),
    });

    if (todayAttendance) {
      return;
    }

    return Activity.from({
      eventId,
      userId,
      participatedOn,
    });
  }
}
