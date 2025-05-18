import { DddEvent } from '@libs/ddd/event';

export class UserRegisteredEvent extends DddEvent {
  constructor(
    public readonly userId: string,
    public readonly userName: string,
    public readonly userEmail: string,
    public readonly userRole: string,
  ) {
    super();
  }
}
