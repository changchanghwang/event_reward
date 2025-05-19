import { AUTH_SERVER_EVENT_TOPIC, EventHandler } from '@libs/kafka';
import { Controller } from '@nestjs/common';
import { UserLoggedInEvent } from '@services/external/domain/events';
import { LoginParticipationService } from '@services/participants/application';

@Controller('participants')
export class ParticipationController {
  constructor(
    private readonly loginParticipationService: LoginParticipationService,
  ) {}
  @EventHandler(UserLoggedInEvent, {
    topic: AUTH_SERVER_EVENT_TOPIC,
  })
  async onLoggedIn(event: UserLoggedInEvent) {
    await this.loginParticipationService.onLoggedIn(event);
  }
}
