import { AUTH_SERVER_EVENT_TOPIC, EventHandler } from '@libs/kafka';
import { Controller } from '@nestjs/common';
import { UserLoggedInEvent } from '@services/external/domain/events';
import { LoginActivityService } from '@services/activities/application';

@Controller('participants')
export class ActivityController {
  constructor(private readonly loginActivityService: LoginActivityService) {}

  @EventHandler(UserLoggedInEvent, {
    topic: AUTH_SERVER_EVENT_TOPIC,
  })
  async onLoggedIn(event: UserLoggedInEvent) {
    await this.loginActivityService.onLoggedIn(event);
  }
}
