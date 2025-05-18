import { DddEvent } from '@libs/ddd/event';

export class UserLoggedInEvent extends DddEvent {
  constructor(
    public readonly userId: string,
    public readonly role: string,
  ) {
    super();
  }
}
