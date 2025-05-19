import { Inject, Injectable } from '@nestjs/common';
import { EventRepository } from '@services/events/infrastructure/repository';
import { UserLoggedInEvent } from '@services/external/domain/events';
import { ActivityRepository } from '@services/activities/infrastructure/repository';
import { ActiveEventSpec } from '@services/events/domain/specs';
import { EventType } from '@services/events/domain/model';
import { ActivityGenerator } from '@services/activities/domain/services';

@Injectable()
export class LoginActivityService {
  constructor(
    @Inject('ActivityRepository')
    private readonly activityRepository: ActivityRepository,
    @Inject('EventRepository')
    private readonly eventRepository: EventRepository,
    private readonly activityGenerator: ActivityGenerator,
  ) {}

  async onLoggedIn(userLoggedInEvent: UserLoggedInEvent) {
    const attendanceEvents = await this.eventRepository.findSatisfying(
      new ActiveEventSpec({
        type: EventType.ATTENDANCE,
        startAtPeriod: {
          to: new Date(userLoggedInEvent.lastLoggedInAt),
        },
        endAtPeriod: {
          from: new Date(userLoggedInEvent.lastLoggedInAt),
        },
      }),
    );

    if (attendanceEvents.length === 0) {
      return;
    }

    const activities = await Promise.all(
      attendanceEvents.map((e) =>
        this.activityGenerator.generate(
          e.id,
          userLoggedInEvent.userId,
          EventType.ATTENDANCE,
          userLoggedInEvent.lastLoggedInAt.split('T')[0],
        ),
      ),
    );

    await this.activityRepository.save(activities);
  }
}
