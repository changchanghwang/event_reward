import { Inject, Injectable } from '@nestjs/common';
import { UserLoggedInEvent } from '@services/external/domain/events';
import { ParticipationRepository } from '@services/participants/infrastructure/repository';

@Injectable()
export class LoginParticipationService {
  constructor(
    @Inject('ParticipationRepository')
    private readonly participationRepository: ParticipationRepository,
  ) {}

  async onLoggedIn(event: UserLoggedInEvent) {
    console.log('### Received event in onLoggedIn:', event);

    // TODO: 로그인 시 오늘 출석 이벤트 참여 로그 기록.
  }
}
