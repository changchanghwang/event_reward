import { badRequest } from '@libs/exceptions';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v7 } from 'uuid';

export type EventDocument = Event & Document;

export enum EventType {
  ATTENDANCE = 'ATTENDANCE',
}

export enum EventStatus {
  SCHEDULED = 'SCHEDULED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true, unique: true, trim: true })
  id: string;

  @Prop({ required: true })
  type: EventType;

  @Prop()
  startAt?: Date;

  @Prop()
  endAt?: Date;

  @Prop({ required: true })
  status: EventStatus;

  @Prop()
  transitAt?: Date;

  constructor(args: {
    id: string;
    type: EventType;
    startAt?: Date;
    endAt?: Date;
    status: EventStatus;
    transitAt?: Date;
  }) {
    if (args) {
      this.id = args.id;
      this.type = args.type;
      this.startAt = args.startAt;
      this.endAt = args.endAt;
      this.status = args.status;
      this.transitAt = args.transitAt;
    }
  }

  static from(args: { type: EventType; startAt?: Date; endAt?: Date }): Event {
    if (args.startAt?.valueOf() < new Date().valueOf()) {
      throw badRequest('Start time must be in the future', {
        errorMessage: '시작 시간은 현재 시간 이후여야 합니다.',
      });
    }

    if (args.endAt?.valueOf() < new Date().valueOf()) {
      throw badRequest('End time must be in the future', {
        errorMessage: '종료 시간은 현재 시간 이후여야 합니다.',
      });
    }

    return new Event({
      id: v7(),
      type: args.type,
      startAt: args.startAt,
      endAt: args.endAt,
      status: EventStatus.SCHEDULED,
    });
  }

  start() {
    if (this.status !== EventStatus.SCHEDULED) {
      throw badRequest('Event is not SCHEDULED', {
        errorMessage: '이벤트가 대기상태가 아닙니다.',
      });
    }
    this.status = EventStatus.PROCESSING;
    const now = new Date();
    this.startAt = this.startAt ?? now;
    this.transitAt = now;
  }

  complete() {
    if (this.status !== EventStatus.PROCESSING) {
      throw badRequest('Event is not processing', {
        errorMessage: '이벤트가 진행 중이 아닙니다.',
      });
    }

    const now = new Date();
    this.status = EventStatus.COMPLETED;
    this.endAt = this.endAt ?? now;
    this.transitAt = now;
  }

  cancel() {
    if (this.status !== EventStatus.SCHEDULED) {
      throw badRequest('Event is not SCHEDULED', {
        errorMessage: '이벤트가 대기상태가 아닙니다.',
      });
    }

    this.status = EventStatus.CANCELLED;
    this.transitAt = new Date();
  }
}

export const EventSchema = SchemaFactory.createForClass(Event);
