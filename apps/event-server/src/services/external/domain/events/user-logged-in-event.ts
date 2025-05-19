export class UserLoggedInEvent {
  constructor(
    public readonly userId: string,
    public readonly role: string,
    public readonly lastLoggedInAt: DateTime,
  ) {}
}
