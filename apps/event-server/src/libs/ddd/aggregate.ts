import { DddEvent } from '@libs/ddd/event';

export abstract class AggregateRoot {
  private _events: DddEvent[] = [];

  getPublishedEvents() {
    return this._events;
  }

  protected publishEvent(event: DddEvent) {
    this._events.push(event);
  }
}
